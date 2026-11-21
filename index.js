import { createChatService, createRoute, FILE_MODES, groupFolderId, isFolderPath, LIMITS } from './host.js';
import { MAX_FILE_CHARS, normalizeProjectPath } from './project-files.js';
import { MAX_TURN_ENTRIES } from './engine.js';

const LEGACY_PROJECT_FILES = 3;

export const inject = ['connection', 'llm', 'workspaceRegistry', 'storageDomain', 'fs'];
const phases = new Set(['ideas', 'review', 'summary', 'reply', 'dialogue', 'change-review']);
const turnStates = new Set(['running', 'completed', 'partial', 'failed', 'cancelled', 'interrupted']);
const entryStates = new Set(['running', 'completed', 'failed', 'cancelled']);
const bounded = (s, max) => typeof s === 'string' && s.length > 0 && s.length <= max;
const utc = s => bounded(s, 40) && /^\d{4}-\d{2}-\d{2}T/.test(s) && Number.isFinite(Date.parse(s));
const uuid = s => bounded(s, 36) && /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/.test(s);
const optionalTrimmed = (value, max) => value === undefined || typeof value === 'string' && value.length <= max && value === value.trim();
function requireState(condition) { if (!condition) throw new Error('Invalid model group chat record'); }
function validateRoster(members, moderatorKey) {
  requireState(Array.isArray(members) && members.length <= 4);
  const keys = new Set();
  for (const member of members) {
    requireState(member && bounded(member.key, 1000) && bounded(member.provider, 1000) && bounded(member.model, 1000)
      && bounded(member.label, 320) && member.key === JSON.stringify([member.provider, member.model])
      && optionalTrimmed(member.role, LIMITS.role) && optionalTrimmed(member.rolePrompt, LIMITS.rolePrompt) && !keys.has(member.key));
    keys.add(member.key);
  }
  requireState(moderatorKey === undefined || keys.has(moderatorKey));
  return keys;
}

/** The domain facility calls parse when opening a persisted table. No runtime package imports needed. */
export function validateRoom(room) {
  requireState(room && uuid(room.id) && bounded(room.workspaceId, 160) && bounded(room.title, LIMITS.title)
    && utc(room.createdAt) && utc(room.updatedAt) && Number.isSafeInteger(room.revision) && room.revision >= 0
    && (room.createDigest === undefined || typeof room.createDigest === 'string' && /^[a-f0-9]{64}$/.test(room.createDigest)));
  requireState(room.fileMode === undefined || FILE_MODES.includes(room.fileMode));
  const boundFolder = room.workspaceId.startsWith('group-folder:');
  if (boundFolder) requireState(isFolderPath(room.folderPath) && room.workspaceId === groupFolderId(room.folderPath) && room.folderTitle !== undefined);
  else requireState(room.folderPath === undefined);
  if (room.folderTitle !== undefined) {
    requireState(bounded(room.folderTitle, LIMITS.folderTitle) && room.folderTitle === room.folderTitle.trim() && !/[\u0000-\u001f\u007f]/.test(room.folderTitle));
  }
  const currentKeys = validateRoster(room.members, room.moderatorKey);
  requireState(room.writerKey === undefined || currentKeys.has(room.writerKey));
  requireState(room.isDraft === undefined || room.isDraft === (currentKeys.size === 0));
  requireState(Array.isArray(room.memberKeys) && room.memberKeys.length === currentKeys.size
    && room.members.every((member, i) => member.key === room.memberKeys[i]));
  requireState(Array.isArray(room.turns) && room.turns.length <= LIMITS.turns);
  const seen = new Set();
  for (const [i, t] of room.turns.entries()) {
    requireState(t && uuid(t.id) && !seen.has(t.id) && bounded(t.text, LIMITS.text) && utc(t.createdAt)
      && turnStates.has(t.status) && (t.status === 'running' ? phases.has(t.phase) && i === room.turns.length - 1 : t.phase === 'done')
      && Array.isArray(t.entries) && t.entries.length <= MAX_TURN_ENTRIES);
    // Legacy turns predate settings edits and have no frozen roster yet.
    const keys = t.members === undefined ? currentKeys : validateRoster(t.members, t.moderatorKey);
    requireState(t.members !== undefined || t.moderatorKey === undefined);
    requireState(keys.size > 0 && (t.recipientKey === undefined || keys.has(t.recipientKey)));
    requireState(t.freeTalk === undefined || t.freeTalk === true && t.recipientKey === undefined && keys.size >= 2);
    requireState(t.dialogueLimit === undefined || t.dialogueLimit === true && t.freeTalk === true);
    seen.add(t.id);
    requireState(t.includeProject === undefined || t.includeProject === true);
    requireState(t.fileMode === undefined || FILE_MODES.includes(t.fileMode));
    requireState(t.fileAccessed === undefined || t.fileAccessed === true);
    if (t.project !== undefined) {
      requireState(t.project && bounded(t.project.name, LIMITS.folderTitle) && !/[\\/\u0000-\u001f\u007f]/u.test(t.project.name)
        && Array.isArray(t.project.files) && t.project.files.length <= 3);
      requireState(t.project.files.every(file => file && normalizeProjectPath(file.path) === file.path && !file.path.includes('/')
        && bounded(file.text, 2000) && typeof file.truncated === 'boolean'));
      requireState(new Set(t.project.files.map(file => file.path)).size === t.project.files.length);
    }
    if (t.projectFiles !== undefined) {
      requireState(Array.isArray(t.projectFiles) && t.projectFiles.length > 0 && t.projectFiles.length <= LEGACY_PROJECT_FILES
        && typeof t.contextDigest === 'string' && /^[a-f0-9]{64}$/.test(t.contextDigest));
      requireState(t.projectFiles.every(file => file && normalizeProjectPath(file.path) === file.path
        && bounded(file.text, MAX_FILE_CHARS) && typeof file.truncated === 'boolean'));
      requireState(new Set(t.projectFiles.map(file => file.path)).size === t.projectFiles.length);
    } else requireState(t.contextDigest === undefined);
    for (const entry of t.entries) {
      requireState(entry && phases.has(entry.phase) && keys.has(entry.modelKey) && bounded(entry.label, 1000)
        && (entry.phase !== 'dialogue' || t.freeTalk === true)
        && (entry.recipientLabel === undefined || entry.phase === 'dialogue' && bounded(entry.recipientLabel, 320))
        && optionalTrimmed(entry.role, LIMITS.role) && !Object.hasOwn(entry, 'rolePrompt')
        && entryStates.has(entry.status) && typeof entry.text === 'string' && entry.text.length <= LIMITS.text
        && (entry.code === undefined || /^[A-Z_]{1,48}$/.test(entry.code)));
    }
  }
  return room;
}
const spec = { name: 'model_group_chat', version: 1, layout: 'per-record', tables: { rooms: { valueSchema: { parse: validateRoom } } } };

function registerRoomTools(ctx, service) {
  const workspaceFor = agent => agent && ctx.workspaceRegistry.list().find(workspace => workspace.sessionIds.includes(agent.session.id));
  const roomMeta = room => ({
    id: room.id, title: room.title, workspaceId: room.workspaceId, active: room.active,
    memberKeys: room.memberKeys, moderatorKey: room.moderatorKey, turnCount: room.turnCount,
  });
  ctx.tools.register({
    name: 'model_group_chat',
    description: 'List, create, or stop model group chats in the current DSH workspace at the human’s request. This tool never reads discussion text or sends messages to model providers. Sending is a human-only action in the group chat panel. Call snapshot to find model keys before creating a room.',
    parameters: { type: 'object', additionalProperties: false, required: ['action'], properties: {
      action: { type: 'string', enum: ['snapshot', 'create', 'cancel'] },
      roomId: { type: 'string', maxLength: 160 }, title: { type: 'string', maxLength: LIMITS.title },
      memberKeys: { type: 'array', minItems: 2, maxItems: 4, items: { type: 'string', maxLength: 1000 } },
      moderatorKey: { type: 'string', maxLength: 1000 },
    } },
    output: { schema: { type: 'string' }, render: (_args, value) => [{ type: 'text', text: value }] },
    async execute(args, exec) {
      const workspace = workspaceFor(exec.agent);
      if (!workspace) throw new Error('The current session does not belong to a registered workspace.');
      exec.signal.throwIfAborted();
      let result;
      if (args.action === 'snapshot') {
        const { models, catalogWarnings, rooms, capabilities } = await service.dispatch({ action: 'snapshot' }, 'tool');
        result = { models, catalogWarnings, capabilities, workspaceId: workspace.id, rooms: rooms.filter(room => room.workspaceId === workspace.id).map(roomMeta) };
      } else if (args.action === 'create') {
        const { title, memberKeys, moderatorKey } = args;
        result = roomMeta(await service.dispatch({ action: 'create', title, memberKeys, moderatorKey, workspaceId: workspace.id }, 'tool'));
      } else if (args.action === 'cancel') {
        const rooms = await service.dispatch({ action: 'rooms' }, 'tool');
        if (!rooms.some(room => room.id === args.roomId && room.workspaceId === workspace.id)) throw new Error('No such room in the current workspace.');
        exec.signal.throwIfAborted();
        result = roomMeta(await service.dispatch({ action: 'cancel', roomId: args.roomId }, 'tool'));
      }
      return JSON.stringify(result);
    },
  }, { when: ({ agent }) => Boolean(workspaceFor(agent)) });
}

export function apply(ctx) {
  let disposed = false;
  let domain;
  let service;
  let release;
  const log = message => ctx.logger.warn(message);
  const starting = (async () => {
    domain = await ctx.storageDomain.open(spec);
    if (disposed) return;
    const raw = domain.table('rooms');
    const table = {
      entries: () => raw.entries(), get: id => raw.get(id), get size() { return raw.size; },
      put: (id, room) => raw.put(id, validateRoom(room)), delete: id => raw.delete(id),
      update: (id, transform) => raw.update(id, room => validateRoom(transform(room))),
    };
    service = createChatService({ table, registry: ctx.workspaceRegistry, llm: ctx.llm, fs: ctx.fs, log });
    await service.recover();
    if (!disposed) {
      release = ctx.connection.fetch.register({ path: '/api/model-group-chat', methods: ['POST'], requestBody: 'streaming', fetch: createRoute(service, log) });
      ctx.inject(['tools'], toolCtx => registerRoomTools(toolCtx, service));
    }
  })();
  ctx.effect(() => async () => {
    disposed = true;
    try { await starting; } catch { /* activation failure is reported by Loader */ }
    try { await release?.(); }
    finally {
      try { await service?.close(); }
      finally { await domain?.close(); }
    }
  }, 'model group chat lifecycle');
  return starting;
}
