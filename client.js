window.__ModuleLoader__.load({
  id: '@local/dsh-model-group-chat',
  factory(require) {
    const React = require('react');
    const { createElement: h, Fragment, useId, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } = React;
    const ID = 'model-group-chat';
    const NS = 'modelGroupChat';
    const en = {
      freeTalk: 'Free discussion', dialogue: 'Peer discussion', 'change-review': 'Change review',
      freeTalkHelp: 'Members can ask and answer each other. Click the send button again to stop. Up to 24 follow-up messages may be billed by your providers.',
      reviewSharing: 'If this change is applied, its contents will be sent to the other participating models for review.',
      freeTalkRunning: 'Free discussion in progress', stopFreeTalk: 'Stop free discussion',
      dialogueLimit: 'Free discussion reached the 24-message limit.',
      writerMember: 'Member allowed to write', writerUnassigned: 'No group writer (direct reply or sole member only)',
      writerNote: 'Only this member can propose writes when the file mode allows it. Each write still needs your approval. In group sends, reviewers receive the successfully applied changes.',
      panel: 'Model group chat', room: 'Discussion', create: 'New group chat', untitledGroup: 'New group chat', newInFolder: 'New group chat in this folder', folderGroup: 'Chats in this folder', refresh: 'Refresh', loading: 'Loading…',
      folderLabel: 'Folder', defaultFolder: 'Default workspace', chooseFolder: 'Choose a folder', folderLocked: 'The folder is fixed after the first message.',
      folderPickerUnavailable: 'Could not open the system folder picker.', setupModels: 'Set up models', modelSetupHint: 'Configure members in the top-right corner before sending.',
      discardGroup: 'Discard empty group', deleteGroup: 'Delete group chat', deleteGroupConfirm: 'Permanently delete “{title}” and its messages? Project files will not be deleted.', deleteGroupBusy: 'Stop the current reply before deleting this group chat.', deleteGroupWorking: 'Deleting…', deleteGroupFailed: 'Could not delete this group chat. Refresh and try again.', cancelDelete: 'Cancel', 'draft-locked': 'Only an unconfigured group without messages can be discarded.',
      'room-unconfigured': 'Configure at least one model before sending.', 'folder-locked': 'You cannot change the folder after the first message.', 'folder-unavailable': 'This folder is unavailable. Choose an existing local folder.',
      rolePreset: 'Role preset', roleNone: 'No preset', roleCustom: 'Custom role', roleProductManager: 'Product manager', roleDesigner: 'Designer', roleDeveloper: 'Developer', roleTester: 'QA tester', roleArchitect: 'Architect', roleReviewer: 'Reviewer',
      rolePrompt: 'Role instructions', rolePromptPlaceholder: 'Describe the perspective this member should bring.', resetRolePrompt: 'Reset to preset instructions', noModerator: 'No summary', rolePromptCount: '{count}/1000 characters',
      roleProductManagerPrompt: 'You are a product manager. Clarify user needs, success criteria, priority, risks, and trade-offs.',
      roleDesignerPrompt: 'You are a designer. Explain user journeys, interaction states, accessibility, and how to validate the design.',
      roleDeveloperPrompt: 'You are a developer. Propose maintainable implementation steps, interfaces, edge cases, and verification.',
      roleTesterPrompt: 'You are a QA tester. Identify acceptance criteria, failure paths, regression risks, and what remains unverified.',
      roleArchitectPrompt: 'You are an architect. Compare component boundaries, data ownership, reliability, and migration trade-offs.',
      roleReviewerPrompt: 'You are a reviewer. Evaluate the request against evidence, highlighting concrete defects, risks, and missing checks.',
      name: 'Discussion name', workspace: 'Workspace', chooseWorkspace: 'Choose a workspace',
      members: 'Members · choose 1–4', moderator: 'Summary model', chooseModerator: 'Choose a summary model',
      filter: 'Search models', noResults: 'No matching models.', noModels: 'Add a text model in Settings → Models, then refresh.',
      noWorkspaces: 'No workspaces yet.', addWorkspace: 'Add workspace', workspacePickerUnavailable: 'The workspace picker is unavailable. Add a workspace from the DSH sidebar, then refresh.', catalogWarning: 'Could not load some providers',
      opening: 'Select a discussion or create one to get started.', notStarted: 'Ask the group a question to start the first round.',
      rounds: 'Independent answers · optional summary', privacy: 'Sending shares your message and recent discussion context with the selected model providers. Project files are never attached automatically.',
      privateReply: 'This sends your message and recent context to the named model only. The reply is saved in this room, and later sends may share it. Project files are never attached automatically.',
      fileAccess: 'Project file access', fileAccessCurrent: 'Current: {mode}', fileModeReadOnly: 'Read-only', fileModeWorkspaceWrite: 'Workspace write · approval required', fileModeFull: 'Full access · approval required',
      applyFileMode: 'Apply file access', applyingFileMode: 'Applying…', fileModeBusy: 'File access can only change while the group chat is idle.',
      fileAccessScope: 'All participants can read within the selected file mode. Writes also require an eligible member and your approval. Shell commands are unavailable.',
      fileFullWarning: 'Full access lets the model request supported file operations outside the selected folder only for absolute paths you explicitly provide in the message you send. OS permissions and sensitive-path restrictions still apply. Every write still requires your approval. File contents read may be sent to the model provider.',
      confirmFullFileMode: 'I understand and want to enable full access.',
      filePrivacy: 'Models can browse the selected project as needed. Any files they read may be shared with their providers.',
      filePrivacyDirect: 'File contents read during a direct reply may be sent to the named model’s provider. The reply is saved here and may be shared as context in later sends.',
      fileModeSaved: 'Project file access updated.', unknownFileMode: 'Could not confirm the file access change. Check the current settings before retrying.',
      'project-access-unavailable': 'File access is unavailable for this folder. Choose an available folder or use read-only mode.', 'file-approval-expired': 'This change is no longer awaiting approval.',
      fileApproval: 'Review proposed file change', fileApprovalEdit: 'Edit file', fileApprovalCreate: 'Create file', fileApprovalBefore: 'Text to replace', fileApprovalAfter: 'Replacement text', fileApprovalNew: 'New file contents',
      fileApprovalExact: 'Approval applies only to this change. You can also stop the current reply.', fileApprovalIncomplete: 'The exact change is unavailable. You can reject it or stop the reply.',
      approveFileWrite: 'Approve this change', rejectFileWrite: 'Reject change', decidingFileWrite: 'Sending decision…', unknownFileDecision: 'Could not confirm your decision. Check whether this change is still pending before trying again.',
      fileAccessed: 'Project file tools used in this turn',
      noProjectFolder: 'No project folder selected. Choose a local folder above.', projectFolderUnavailable: 'The project files could not be inspected. The selected folder name is still included.',

      projectContext: 'Project excerpts', truncatedExcerpt: 'Excerpt truncated',
      unknownRead: 'Could not load this view. Refresh and try again.', unknownCreate: 'Creation could not be confirmed. Retrying with the same details will not create a duplicate.',
      unknownStop: 'Could not confirm that the discussion stopped. Refresh to check its status.',
      recipient: 'Send to', everyone: 'All members', me: 'You', placeholder: 'Type a question or a follow-up…',
      send: 'Send to group', sendOne: 'Send to member', cancel: 'Stop', stopping: 'Stopping…', older: 'Show earlier messages',
      creating: 'Creating…', missingWorkspace: 'This workspace is no longer registered. You can still view the history.',
      storageFailed: 'The last update could not be saved. Reopen the plugin before sending again.',
      ideas: 'Independent answers', review: 'Peer review', summary: 'Moderator summary', reply: 'Direct reply',
      running: 'In progress', completed: 'Complete', partial: 'Some calls failed', failed: 'Failed', cancelled: 'Stopped', interrupted: 'Interrupted',
      working: 'Waiting for a reply…', noAnswer: 'No reply was saved.', retry: 'Retry', unknownError: 'Could not reach the group chat service. Refresh and check whether your last message was saved before sending again.',
      'invalid-request': 'Check the entered values and try again.', 'body-too-large': 'This request is too large.', 'not-found': 'This discussion does not exist.',
      'workspace-unavailable': 'The selected workspace is no longer available.', 'model-unavailable': 'A model is no longer available. Refresh the model list.',
      'room-busy': 'This discussion is already running.', 'too-many-active': 'Two discussions are already running. Stop one or wait for it to finish.',
      'room-limit': 'This installation has reached the 30-discussion limit.', 'turn-limit': 'This discussion has reached 40 messages. Start a new one to continue.',
      'share-required': 'Use the Send button to share the discussion with your chosen providers.', 'unavailable': 'Group chat is restarting. Refresh and try again.', 'storage-failed': 'The conversation could not be saved. Refresh before retrying.',
      AUTH: 'Authentication failed. Check Settings → Models.', MISSING_CREDENTIAL: 'No API credential is configured.', RATE_LIMIT: 'The provider is rate limited.',
      TIMEOUT: 'The provider did not reply in time.', NO_ADAPTER: 'The provider is no longer configured.', MAX_TOKENS: 'The model reached its output limit before answering.',
      QUOTA: 'The provider has no available quota.', ACCOUNT_QUOTA: 'The provider account has no available quota.', CONTEXT_WINDOW_EXCEEDED: 'The model’s context is too small for this discussion.',
      EMPTY_RESPONSE: 'The model returned no visible text.', HOST_INTERRUPTED: 'The host closed before this reply finished.',
      'stale-revision': 'This group changed elsewhere. Reload its latest settings before editing again.',
      settings: 'Group settings', close: 'Close', save: 'Save changes', saving: 'Saving…', groupSettings: 'Group information',
      role: 'Role', roleExample: 'e.g. reviewer, architect, or tester', roleHint: 'Role instructions guide future replies; they do not grant tools or file access. Adding a member can share recent context on the next send. Saving does not send messages.',
      unavailableModel: 'Not currently configured', archivedWorkspace: 'Removed workspace', noRooms: 'No group chats in this workspace yet.',
      workspaceGroups: 'Group chats in this workspace', groupCount: '{count} members', allGroups: 'All group chats', roomList: 'Group chat list', showGroupTree: 'Show group list', hideGroupTree: 'Hide group list',
      back: 'Back to group chats', openModelSettings: 'Add in Settings → Models, then refresh', settingsUnsupported: 'Restart DSH to load the updated group settings service.',
      jumpLatest: 'Jump to latest', online: 'Active', sidebar: 'Toggle sidebar', unknownSave: 'Could not confirm the changes. Check the current settings before retrying.',
      widthLeft: 'Resize conversation from the left', widthRight: 'Resize conversation from the right', widthHelp: 'Drag, or use Left and Right arrows. Double-click or press Delete to reset.', widthValue: '{width} pixels',
      latest: 'Check current settings', rebase: 'Keep this form for replacement', staleNote: 'Choose the current settings or keep this form. Saving a kept form replaces the current name, members, roles, role instructions, summary model and writing member.',
      discard: 'Use current settings', currentMembers: 'Current members', currentTitle: 'Current name',
      STORAGE_FAILED: 'This reply could not be saved.', CANCELLED: 'Stopped before completion.', CALL_FAILED: 'The provider failed to answer.',
      formerAudience: 'The selected member was removed. Review the recipient before sending.', workingTitle: 'Models are responding…',
    };
    const zh = {
      freeTalk: '畅所欲言', dialogue: '互问互答', 'change-review': '修改评议',
      freeTalkHelp: '成员可以互相提问和回答；再次点击发送位置的停止键即可结束。最多追加 24 条发言，模型调用可能产生费用。',
      freeTalkRunning: '畅所欲言进行中', stopFreeTalk: '停止畅所欲言',
      dialogueLimit: '畅所欲言已达到 24 条追加发言上限。',
      writerMember: '写入成员', writerUnassigned: '不指定群发写入成员（仅定向回复或单成员群可写）',
      writerNote: '只有该成员可在允许写入的文件权限下提出修改，每次仍需你批准。群发时，已成功写入的改动内容会发给其他参与模型评议。',
      reviewSharing: '如果写入成功，这项改动的内容将发送给其他参与模型评议。',
      panel: '模型群聊', room: '讨论', create: '新群聊', untitledGroup: '新建群聊', newInFolder: '在此文件夹新建群聊', folderGroup: '此文件夹中的群聊', refresh: '刷新', loading: '加载中…',
      folderLabel: '文件夹', defaultFolder: '默认工作区', chooseFolder: '选择文件夹', folderLocked: '发送第一条消息后不能更改文件夹。',
      folderPickerUnavailable: '无法打开系统文件夹选择器。', setupModels: '配置模型', modelSetupHint: '发送前，请在右上角配置群成员。',
      discardGroup: '删除空白群聊', deleteGroup: '删除群聊', deleteGroupConfirm: '永久删除「{title}」及其所有聊天记录？不会删除项目文件。', deleteGroupBusy: '请先停止当前回复，再删除此群聊。', deleteGroupWorking: '正在删除…', deleteGroupFailed: '无法删除此群聊，请刷新后重试。', cancelDelete: '取消', 'draft-locked': '只能删除尚未配置、没有消息的空白群聊。',
      'room-unconfigured': '请至少配置一个模型再发送。', 'folder-locked': '发送第一条消息后不能更改文件夹。', 'folder-unavailable': '该文件夹不可用，请选择已存在的本地文件夹。',
      rolePreset: '角色预设', roleNone: '不使用预设', roleCustom: '自定义角色', roleProductManager: '产品经理', roleDesigner: '设计师', roleDeveloper: '开发者', roleTester: '测试工程师', roleArchitect: '架构师', roleReviewer: '评审员',
      rolePrompt: '角色提示词', rolePromptPlaceholder: '例如：你是一名资深测试工程师，优先识别边界情况和回归风险。', resetRolePrompt: '恢复预设提示词', noModerator: '不生成总结', rolePromptCount: '{count}/1000 字符',
      roleProductManagerPrompt: '你是一名产品经理。梳理用户需求、成功标准、优先级、风险和取舍。',
      roleDesignerPrompt: '你是一名设计师。关注用户流程、交互状态、无障碍设计，并说明如何验证体验。',
      roleDeveloperPrompt: '你是一名开发者。给出可维护的实现步骤，说明接口、边界情况与验证方法。',
      roleTesterPrompt: '你是一名测试工程师。列出验收标准、失败路径和回归风险，标明尚未验证的内容。',
      roleArchitectPrompt: '你是一名架构师。比较模块边界、数据归属、可靠性和迁移取舍。',
      roleReviewerPrompt: '你是一名评审员。结合需求与证据，指出具体缺陷、风险和遗漏的检查。',
      name: '讨论名称', workspace: '工作区', chooseWorkspace: '请选择工作区',
      members: '群成员 · 选择 1–4 个模型', moderator: '总结模型', chooseModerator: '请选择总结模型',
      filter: '搜索模型', noResults: '没有匹配的模型。', noModels: '请在「设置 → 模型」配置文本模型，再刷新。',
      noWorkspaces: '还没有工作区。', addWorkspace: '添加工作区', workspacePickerUnavailable: '工作区选择器不可用。请从 DSH 侧栏添加工作区，然后刷新。', catalogWarning: '部分厂商的模型列表未加载',
      opening: '选择一个已有讨论，或新建讨论。', notStarted: '发出第一个问题，开始讨论。',
      rounds: '独立作答 · 可选总结', privacy: '发送会把本条消息和近期讨论上下文发给所选模型的提供商。不会自动附加项目文件。',
      privateReply: '本轮只把消息和近期上下文发给指定模型。回复仍保存在群历史中，后续发送时可能共享。不会自动附加项目文件。',
      fileAccess: '项目文件权限', fileAccessCurrent: '当前：{mode}', fileModeReadOnly: '仅可查看', fileModeWorkspaceWrite: '工作区内修改', fileModeFull: '完全权限',
      applyFileMode: '应用文件权限', applyingFileMode: '正在应用…', fileModeBusy: '只能在群聊空闲时更改文件权限。',
      fileAccessScope: '所有参与的模型都可按当前文件权限读取。写入还需由有权成员提出，并由你批准。不提供 Shell 命令。',
      fileFullWarning: '对于所选文件夹之外的位置，模型只能对你在本条消息中用双引号或反引号标出的确切绝对路径请求受支持的文件操作，仍受操作系统权限和敏感路径限制。每次写入仍需你批准。读取的文件内容可能会发送给模型提供商。',
      confirmFullFileMode: '我了解风险并希望启用完全访问。',
      filePrivacy: '模型可按需浏览所选项目；读取的文件内容可能会发送给相应模型提供商。',
      filePrivacyDirect: '定向回复中读取的文件内容可能会发送给指定模型的提供商。回复会保存在群聊中，之后发送消息时可能作为上下文共享。',
      fileModeSaved: '项目文件权限已更新。', unknownFileMode: '无法确认文件权限是否已更改。请先查看当前设置，再决定是否重试。',
      'project-access-unavailable': '此文件夹不支持文件访问。请选择可用的文件夹或使用只读模式。', 'file-approval-expired': '此更改已不再等待批准。',
      fileApproval: '审核拟议的文件更改', fileApprovalEdit: '编辑文件', fileApprovalCreate: '创建文件', fileApprovalBefore: '要替换的文本', fileApprovalAfter: '替换后的文本', fileApprovalNew: '新文件的内容',
      fileApprovalExact: '批准仅对这一处更改有效。你也可以停止当前回复。', fileApprovalIncomplete: '无法查看确切的更改。你可以拒绝它或停止回复。',
      approveFileWrite: '批准此更改', rejectFileWrite: '拒绝更改', decidingFileWrite: '正在提交决定…', unknownFileDecision: '无法确认决定是否已收到。请先查看此更改是否仍待批准，再决定是否重试。',
      fileAccessed: '此轮使用了项目文件工具',
      projectFolderUnavailable: '无法检查项目文件；仍会发送已选文件夹名称。',
      noProjectFolder: '未选择项目文件夹，请在上方选择本地文件夹。',
      projectContext: '项目摘录', truncatedExcerpt: '摘录已截断',
      unknownRead: '无法加载当前内容，请刷新重试。', unknownCreate: '无法确认是否创建成功。用相同设置重试不会重复创建。',
      unknownStop: '无法确认是否已停止，请刷新查看状态。',
      recipient: '发送给', everyone: '全体成员', me: '你', placeholder: '输入问题或继续追问…',
      send: '发给群成员', sendOne: '发给指定成员', cancel: '停止', stopping: '正在停止…', older: '展开更早的消息',
      creating: '正在创建…', missingWorkspace: '该工作区已被移除，仍可查看讨论历史。',
      storageFailed: '最后一次更新未能保存。请重新加载插件后再发送。',
      ideas: '独立作答', review: '交叉评审', summary: '总结', reply: '定向回复',
      running: '进行中', completed: '完成', partial: '部分调用失败', failed: '失败', cancelled: '已停止', interrupted: '已中断',
      working: '等待回复…', noAnswer: '没有保存回复。', retry: '重试', unknownError: '无法连接群聊服务。请先刷新，确认上一条是否已保存，再决定是否重发。',
      'invalid-request': '请检查填写的内容再试。', 'body-too-large': '请求内容过长。', 'not-found': '找不到这场讨论。',
      'workspace-unavailable': '所选工作区已不可用。', 'model-unavailable': '有模型已不可用，请刷新模型列表。',
      'room-busy': '这场讨论正在运行。', 'too-many-active': '已经有两场讨论正在运行，请等待或停止其中一场。',
      'room-limit': '已达到 30 个讨论的上限。', 'turn-limit': '这场讨论已达到 40 条消息，请新建讨论继续。',
      'share-required': '请通过发送按钮将内容共享给所选厂商。', 'unavailable': '群聊正在重新启动，请刷新再试。', 'storage-failed': '讨论未能保存，请先刷新再重试。',
      AUTH: '认证失败，请检查「设置 → 模型」。', MISSING_CREDENTIAL: '该模型没有配置 API 凭据。', RATE_LIMIT: '厂商请求已限流。',
      TIMEOUT: '厂商未在期限内回复。', NO_ADAPTER: '该厂商已不在配置中。', MAX_TOKENS: '模型在输出可见答案前用完了预算。',
      QUOTA: '厂商额度不足。', ACCOUNT_QUOTA: '厂商账户额度不足。', CONTEXT_WINDOW_EXCEEDED: '模型上下文窗口不足。',
      EMPTY_RESPONSE: '模型未返回可见文本。', HOST_INTERRUPTED: '宿主关闭时，该回复尚未完成。',
      'stale-revision': '该群聊已在其他地方更新。请先读取最新设置，再编辑。',
      settings: '群聊设置', close: '关闭', save: '保存修改', saving: '正在保存…', groupSettings: '群聊信息',
      role: '角色', roleExample: '例如：代码评审、架构设计、测试', roleHint: '角色提示词指导后续回复，不授予工具或文件访问权限。新增成员的提供商可能在下次发送时收到近期上下文。保存设置不会发送聊天内容。',
      unavailableModel: '当前未配置', archivedWorkspace: '已移除的工作区', noRooms: '这个工作区还没有群聊。',
      workspaceGroups: '本工作区的群聊', groupCount: '{count} 位成员', allGroups: '全部群聊', roomList: '群聊列表', showGroupTree: '显示群聊列表', hideGroupTree: '隐藏群聊列表',
      back: '返回群聊列表', openModelSettings: '可在「设置 → 模型」添加模型，然后刷新', settingsUnsupported: '请重启 DSH 以加载新版群聊设置。',
      jumpLatest: '回到最新消息', online: '讨论中', sidebar: '切换左侧栏', unknownSave: '无法确认是否保存成功，请先查看当前设置再重试。',
      widthLeft: '从左侧调节聊天宽度', widthRight: '从右侧调节聊天宽度', widthHelp: '拖动或用左右方向键调节。双击或按 Delete 恢复默认。', widthValue: '{width} 像素',
      latest: '查看当前设置', rebase: '保留表单，待覆盖', staleNote: '可载入当前设置，或保留这里填写的内容。保留后再保存会覆盖当前名称、成员、角色、角色提示词、总结模型和写入成员。',
      discard: '使用当前设置', currentMembers: '当前成员', currentTitle: '当前群聊名称',
      STORAGE_FAILED: '这条回复未能保存。', CANCELLED: '回复未完成即停止。', CALL_FAILED: '模型调用失败。',
      formerAudience: '原来指定的成员已被移除。请确认收件人后再发送。', workingTitle: '模型正在回复…',
    };
    const css = `
      .mgc-page{height:100%;width:100%;min-width:0;min-height:0;display:flex;flex-direction:column;container-type:inline-size;overflow:hidden;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit;font-size:14px;line-height:1.55}
      .mgc-page *,.mgc-page *::before,.mgc-page *::after{box-sizing:border-box}
      .mgc-page :focus-visible{outline:1.5px solid var(--dsw-alias-state-business-primary);outline-offset:2px}
      .mgc-page button,.mgc-page input,.mgc-page select,.mgc-page textarea{max-width:100%;font:inherit;color:inherit}
      .mgc-page button{cursor:pointer}.mgc-page button:disabled{opacity:.4;cursor:default}
      .mgc-page h1,.mgc-page h2,.mgc-page p{margin:0}.mgc-page h1,.mgc-page h2{font-size:16px;font-weight:550}
      .mgc-muted{color:var(--dsw-alias-label-secondary);font-size:13px}.mgc-truncate{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .mgc-header{display:flex;align-items:center;justify-content:space-between;flex:none;gap:12px;min-height:50px;padding:10px 20px;border-bottom:.5px solid var(--dsw-alias-border-l3)}
      .mgc-page .mgc-header{padding-inline-start:max(20px,var(--dsh-frame-leading-clearance,0px))}
      .mgc-header-lead,.mgc-actions,.mgc-crumb{display:flex;align-items:center;gap:8px;min-width:0}.mgc-actions{flex:none}
      .mgc-quiet,.mgc-icon-button,.mgc-room-row,.mgc-small-select{display:inline-flex;align-items:center;gap:6px;min-height:30px;padding:4px 8px;border:0;border-radius:var(--dsw-radius-md,8px);background:transparent;color:var(--dsw-alias-label-secondary)}
      .mgc-page :is(.mgc-quiet,.mgc-icon-button,.mgc-room-row,.mgc-small-select):hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}
      .mgc-icon-button{justify-content:center;width:30px;padding:0;flex:none}.mgc-quiet>svg{flex:none}
      .mgc-primary{border:0;border-radius:var(--dsw-radius-lg,16px);padding:6px 13px;min-height:32px;background:var(--dsw-alias-button-info-fill);color:var(--dsw-alias-label-on-color)!important}
      .mgc-primary:hover:not(:disabled),.mgc-send:hover:not(:disabled){background:var(--dsw-alias-button-info-hover)}
      .mgc-scroll{position:relative;flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;scrollbar-gutter:stable both-edges}
      .mgc-column{width:min(calc(100% - 36px),var(--mgc-chat-width,748px));margin-inline:auto;overflow-wrap:anywhere}
      .mgc-conversation,.mgc-message-area{display:flex;flex:1;flex-direction:column;min-height:0;min-width:0;position:relative}
      .mgc-conversation{--mgc-chat-width:748px}
      .mgc-history{padding-block:26px 24px}.mgc-history>article+article{margin-block-start:32px}
      .mgc-resize{position:absolute;inset-block:12px 8px;width:24px;padding:0;border:0;border-radius:var(--dsw-radius-md,8px);background:none;cursor:ew-resize!important;touch-action:none;z-index:1;display:grid;place-items:center;color:var(--dsw-alias-label-tertiary)}
      .mgc-resize[data-side='left']{right:calc(50% + var(--mgc-chat-width) / 2 + 11px)}.mgc-resize[data-side='right']{left:calc(50% + var(--mgc-chat-width) / 2 + 11px)}
      .mgc-resize:after{content:'';width:3px;height:30px;border-radius:3px;background:currentColor;opacity:.60}
      .mgc-resize:hover,.mgc-resize:focus-visible,.mgc-resize[data-dragging='true']{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-state-business-primary)}
      .mgc-conversation[data-resizing='true']{user-select:none;cursor:ew-resize}
      .mgc-notice{color:var(--dsw-alias-label-secondary);font-size:13px;background:var(--dsw-alias-interactive-bg-hover);border-radius:var(--dsw-radius-md,8px);padding:6px 10px;overflow-wrap:anywhere}
      .mgc-page [role='alert']{margin-block:6px}.mgc-user{display:flex;flex-direction:column;align-items:flex-end;gap:5px;margin-bottom:15px}
      .mgc-user-bubble{white-space:pre-wrap;max-width:min(calc(var(--mgc-chat-width,748px) * .702),82%);padding:10px 14px;border-radius:var(--dsw-radius-panel,16px);background:var(--dsw-specific-selector,var(--dsw-alias-interactive-bg-hover));font-size:var(--dsh-content-font-size,14px);line-height:1.65}
      .mgc-bot{display:flex;align-items:flex-start;gap:11px;margin-block:12px 20px}.mgc-avatar{display:grid;place-items:center;width:30px;height:30px;flex:none;border-radius:var(--dsw-radius-md,8px);background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:600}
      .mgc-bot-content{min-width:0;flex:1}.mgc-message-meta{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 8px;margin-block-end:5px;font-size:13px}.mgc-message-meta strong{font-weight:600;color:var(--dsw-alias-label-primary)}
      .mgc-role{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-interactive-bg-hover);border-radius:var(--dsw-radius-sm,4px);padding:0 5px;overflow-wrap:anywhere}
      .mgc-bot-bubble{--mgc-bubble-fill:color-mix(in srgb,var(--dsw-alias-bg-base) 95%,var(--dsw-alias-label-primary));position:relative;width:fit-content;min-width:0;max-width:100%;padding:10px 13px;border:1px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-lg,12px);background:var(--mgc-bubble-fill);color:var(--dsw-alias-label-primary)}
      .mgc-bot-bubble::before{content:'';position:absolute;top:11px;left:-5px;width:8px;height:8px;transform:rotate(45deg);background:var(--mgc-bubble-fill);border-left:1px solid var(--dsw-alias-border-l3);border-bottom:1px solid var(--dsw-alias-border-l3)}
      .mgc-bot[data-phase='summary'] .mgc-bot-bubble{--mgc-bubble-fill:color-mix(in srgb,var(--dsw-alias-bg-base) 95%,var(--dsw-alias-state-business-primary));border-color:color-mix(in srgb,var(--dsw-alias-border-l3) 72%,var(--dsw-alias-state-business-primary))}
      .mgc-bot[data-phase='summary'] .mgc-bot-bubble::before{border-color:inherit}
      .mgc-prose{min-width:0;max-width:100%;font-size:var(--dsh-content-font-size,14px);line-height:1.65;overflow-wrap:anywhere;color:var(--dsw-alias-label-primary)}
      .mgc-page .mgc-prose :is(p,li,th,td,strong,h1,h2,h3){color:var(--dsw-alias-label-primary)}.mgc-page .mgc-prose>div{color:inherit}
      .mgc-prose :where(pre,table){max-width:100%;overflow:auto}.mgc-plain{white-space:pre-wrap}
      .mgc-page details{margin-block:8px 12px}.mgc-page summary{cursor:pointer;color:var(--dsw-alias-label-secondary);width:fit-content;font-size:13px;padding:3px 0}
      .mgc-footer{flex:none;max-block-size:60%;overflow:auto;padding:4px 16px 8px;background:var(--dsw-alias-bg-base)}
      .mgc-compose-notices{max-block-size:min(12dvh,96px);overflow:auto}
      .mgc-compose-notices:empty{display:none}
      .mgc-composer{display:flex;flex-direction:column;gap:8px;width:min(100%,calc(var(--mgc-chat-width,748px) + 32px));margin:0 auto;padding:8px 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-panel,16px);background:var(--dsw-specific-input-major,var(--dsw-alias-bg-base));box-shadow:var(--dsw-elevation-soft)}
      .mgc-composer textarea{display:block;width:100%;min-height:44px;max-height:min(35dvh,210px);border:0;background:transparent;resize:none;padding:4px 5px;font-size:var(--dsh-content-font-size,14px);line-height:calc(24px + var(--dsh-content-font-delta,0px));field-sizing:content}.mgc-composer textarea:focus-visible{outline:0}.mgc-composer:focus-within{border-color:var(--dsw-alias-border-l4)}
      .mgc-recipient{position:relative;min-width:0;max-width:calc(100% - 48px);z-index:3}.mgc-page .mgc-recipient-trigger{display:flex;align-items:center;gap:8px;min-width:0;max-width:min(360px,100%);padding:5px 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-lg,14px);background:var(--dsw-alias-bg-base);font-size:13px}.mgc-recipient-trigger>svg{flex:none}.mgc-recipient-menu{position:absolute;inset-inline-start:0;inset-block-end:calc(100% + 6px);min-width:100%;width:min(360px,calc(100cqw - 56px));max-height:min(220px,35dvh);overflow:auto;padding:4px;border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-panel,14px);background:var(--dsw-alias-bg-base);box-shadow:var(--dsw-elevation-soft)}.mgc-recipient-option{display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:33px;padding:5px 8px;border-radius:var(--dsw-radius-md,8px);cursor:pointer;font-size:13px}.mgc-recipient-option:focus,.mgc-recipient-option:hover,.mgc-recipient-option[aria-selected='true']{background:var(--dsw-alias-interactive-bg-hover)}.mgc-recipient-option:focus-visible{outline-offset:-2px}
      .mgc-recipient-trigger[aria-expanded='true']>svg{transform:rotate(180deg)}.mgc-recipient-menu:popover-open{position:fixed;inset:auto;margin:0;box-sizing:border-box;width:var(--mgc-menu-width);min-width:0;max-height:var(--mgc-menu-height);left:var(--mgc-menu-left);top:var(--mgc-menu-top);color:var(--dsw-alias-label-primary)}
      .mgc-free-talk{flex:none;white-space:nowrap}.mgc-free-talk[aria-pressed=true]{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}.mgc-send-active{outline:2px solid var(--dsw-alias-button-info-fill);outline-offset:2px}
      .mgc-compose-bar{display:flex;justify-content:space-between;align-items:center;gap:10px}.mgc-compose-controls{display:flex;flex-wrap:wrap;align-items:center;gap:4px;min-width:0}.mgc-compose-controls .mgc-recipient{max-width:100%}.mgc-compose-progress{min-width:0;margin-inline-start:auto;text-align:end}.mgc-small-select{font-size:13px!important;max-width:min(280px,100%);cursor:pointer}
      .mgc-project-toggle{display:inline-flex;align-items:center;gap:6px;min-height:30px;padding:2px 7px;border-radius:var(--dsw-radius-md,8px);color:var(--dsw-alias-label-secondary);font-size:13px;cursor:pointer}
      .mgc-project-toggle input{accent-color:var(--dsw-alias-state-business-primary)}.mgc-project-toggle[data-on='true']{background:var(--dsw-alias-interactive-bg-hover)}
      .mgc-file-mode{display:grid;gap:7px}.mgc-file-mode .mgc-file-confirm{display:flex;align-items:baseline;gap:8px}
      .mgc-file-badge{flex:none;padding:2px 7px;border-radius:var(--dsw-radius-md,8px);background:var(--dsw-alias-interactive-bg-hover);font-size:12px;color:var(--dsw-alias-label-secondary)}
      .mgc-folder-row:has(.mgc-file-badge){flex-wrap:wrap}
      .mgc-file-approval{display:grid;gap:6px;width:min(100%,calc(var(--mgc-chat-width,748px) + 32px));margin:0 auto 8px;padding:9px 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md,8px);overflow-wrap:anywhere}
      .mgc-file-approval-path{white-space:pre-wrap;unicode-bidi:isolate}.mgc-file-diff{display:grid;gap:5px;min-width:0}
      .mgc-file-diff pre{max-block-size:min(13dvh,110px);min-width:0;margin:0;padding:5px 8px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;unicode-bidi:isolate;background:var(--dsw-alias-interactive-bg-hover);border-radius:var(--dsw-radius-sm,4px)}
      .mgc-file-approval-actions{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:5px 8px}
      .mgc-project-status{width:min(100%,calc(var(--mgc-chat-width,748px) + 32px));margin:0 auto 5px;color:var(--dsw-alias-label-secondary);font-size:12px;overflow-wrap:anywhere}
      .mgc-context-note{flex:1 1 100%;margin:2px 3px 0;color:var(--dsw-alias-label-secondary);font-size:12px;overflow-wrap:anywhere}
      .mgc-send{display:grid;place-items:center;flex:none;width:34px;height:34px;border:0;border-radius:50%;background:var(--dsw-alias-button-info-fill);color:var(--dsw-alias-label-on-color)!important}
      .mgc-page .mgc-footnote{width:min(100%,calc(var(--mgc-chat-width,748px) + 32px));margin:5px auto 0;text-align:center;color:var(--dsw-alias-label-secondary);font-size:12px;overflow-wrap:anywhere}
      .mgc-create-surface{padding-block:12px 24px}.mgc-editor .mgc-workspace-trigger{justify-content:space-between;text-align:start}
      .mgc-workspace-picker:has(> .mgc-workspace-fallback) > .mgc-workspace-trigger{display:none}
      .mgc-jump{display:flex;justify-content:center;margin:2px auto 8px}.mgc-empty{display:grid;place-content:center;justify-items:center;text-align:center;gap:12px;min-height:65%;padding:24px;color:var(--dsw-alias-label-secondary)}
      .mgc-empty h2{color:var(--dsw-alias-label-primary);font-size:22px}.mgc-directory{padding-block:22px 28px}.mgc-directory>section+section{margin-top:24px}
      .mgc-workspace-title{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-block-end:4px}
      .mgc-room-row{width:100%;justify-content:space-between;text-align:left;min-height:34px;color:var(--dsw-alias-label-primary)}.mgc-room-row span{display:flex;align-items:center;gap:8px;min-width:0}.mgc-room-row svg{flex:none;color:var(--dsw-alias-label-secondary)}
      .mgc-page .mgc-dialog{width:min(560px,calc(100vw - 32px));max-height:min(760px,calc(100dvh - 32px));padding:0;border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-panel,16px);background:var(--dsw-specific-input-major,var(--dsw-alias-bg-base));color:var(--dsw-alias-label-primary);box-shadow:var(--dsw-elevation-soft);overflow:auto}
      .mgc-dialog::backdrop{background:color-mix(in srgb,var(--dsw-alias-label-primary) 20%,transparent)}
      .mgc-dialog-head,.mgc-dialog-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 16px}.mgc-dialog-head{position:sticky;top:0;background:inherit;border-bottom:.5px solid var(--dsw-alias-border-l3);z-index:1}.mgc-dialog-foot{justify-content:flex-end}
      .mgc-editor{display:grid;gap:12px;padding:14px 16px}.mgc-editor label{display:grid;min-width:0;gap:4px}.mgc-editor :is(input:not([type='checkbox']),select){width:100%;padding:6px 9px;border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md,8px);background:var(--dsw-alias-bg-base)}
      .mgc-options{min-width:0;margin:0;border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md,8px);padding:6px 8px}.mgc-catalog{display:grid;max-height:140px;overflow:auto;margin-block-start:6px}.mgc-editor .mgc-choice{display:flex;align-items:baseline;gap:7px;padding:4px 2px}
      .mgc-new-group{height:38px;min-width:0;flex:0 1 45%;display:inline-flex;align-items:center;justify-content:center;gap:5px;padding:0 7px;border:.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-md,10px);background:var(--dsw-alias-button-elevated-fill);color:var(--dsw-alias-label-primary);font:inherit;font-weight:500;white-space:nowrap;cursor:pointer}
      .mgc-new-group:hover{background:var(--dsw-alias-button-floating-hover)}.mgc-new-group[data-wide='false']{width:36px;height:36px;flex:none;border-color:transparent;background:transparent;padding:0}.mgc-new-group>svg{flex:none}.mgc-new-group>span{overflow:hidden;text-overflow:ellipsis}
      .mgc-group-panel{display:flex;flex:1 1 auto;min-height:0;min-width:0;overflow:hidden}
      .mgc-group-tree{flex:0 0 clamp(180px,23%,250px);overflow:auto;padding:12px 10px;background:color-mix(in srgb,var(--dsw-alias-bg-base) 97%,var(--dsw-alias-label-primary));border-inline-end:.5px solid var(--dsw-alias-border-l3)}
      .mgc-tree-room{display:flex;align-items:center;gap:2px;min-width:0}.mgc-group-tree .mgc-room-row{width:100%;min-width:0;flex:1;padding-inline-start:28px;justify-content:flex-start}.mgc-group-tree .mgc-room-row[aria-current='page']{background:var(--dsw-alias-interactive-bg-hover);font-weight:600}
      .mgc-tree-heading{display:flex;justify-content:space-between;align-items:center;gap:6px;padding-inline:5px}.mgc-tree-heading h2{font-size:13px;color:var(--dsw-alias-label-secondary)}
      .mgc-tree-folder{display:flex;align-items:center;gap:7px;margin-block:7px 2px;padding:3px 5px;color:var(--dsw-alias-label-primary);font-size:13px}
      .mgc-tree-folder>.mgc-truncate{flex:1;min-width:0}.mgc-tree-add{flex:none;width:22px;min-width:22px;min-height:22px;height:22px;padding:0;opacity:0;transition:opacity .12s ease,background-color .12s ease}
      .mgc-tree-folder:hover .mgc-tree-add,.mgc-tree-folder:focus-within .mgc-tree-add{opacity:1}
      @media (hover:none){.mgc-tree-add{opacity:1}}
      .mgc-group-main{flex:1 1 auto;min-width:0;min-height:0;display:flex;flex-direction:column}.mgc-folder-row{display:flex;align-items:center;gap:8px;width:min(100%,calc(var(--mgc-chat-width,748px) + 32px));margin:0 auto 5px}.mgc-folder-row>button{max-width:min(100%,320px)}
      .mgc-options.mgc-member-card{display:grid;gap:8px}.mgc-role-prompt{width:100%;min-height:76px;resize:vertical;padding:7px 9px;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md,8px)}.mgc-role-prompt-actions{display:flex;align-items:center;justify-content:space-between;gap:6px}
      .mgc-tree-toolbar{flex:none;display:flex;align-items:center;min-height:38px;padding:3px 12px;border-bottom:.5px solid var(--dsw-alias-border-l3)}
      .mgc-group-tree[hidden]{display:none}
      @container (max-width:810px){.mgc-group-panel{flex-direction:column}.mgc-group-tree{flex:0 0 auto;max-block-size:min(35%,240px);border-inline-end:0;border-block-end:.5px solid var(--dsw-alias-border-l3)}}
      @container (max-width:500px){.mgc-group-panel[data-room='false'][data-tree-collapsed='false'] .mgc-group-main{display:none}.mgc-group-panel[data-room='false'][data-tree-collapsed='false'] .mgc-group-tree{flex:1 1 auto;max-block-size:none;border:0}}
      .mgc-members{display:grid;gap:7px}
      .mgc-field{display:grid;min-width:0;gap:4px}.mgc-field-label{font-size:13px;color:var(--dsw-alias-label-primary)}
      .mgc-select{position:relative;min-width:0}.mgc-select-trigger{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;min-height:36px;padding:8px 12px;border:1px solid var(--dsw-alias-border-l3);border-radius:12px;background:color-mix(in srgb,var(--dsw-alias-bg-base) 94%,var(--dsw-alias-label-primary));color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;text-align:start;cursor:pointer;transition:border-color .15s ease,box-shadow .15s ease,background-color .15s ease}
      .mgc-select-trigger:hover:enabled{border-color:var(--dsw-alias-border-l4)}
      .mgc-select-trigger[aria-expanded='true']{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--dsw-alias-state-business-primary) 22%,transparent)}
      .mgc-select-trigger:disabled{opacity:.62;cursor:default}.mgc-select-trigger>svg{flex:none;transition:transform .15s ease}.mgc-select-trigger[aria-expanded='true']>svg{transform:rotate(180deg)}
      .mgc-select-menu:popover-open{position:fixed;inset:auto;margin:0;box-sizing:border-box;display:grid;gap:2px;width:var(--mgc-menu-width);max-height:var(--mgc-menu-height,240px);overflow:auto;padding:5px;border:1px solid var(--dsw-alias-border-l3);border-radius:14px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);box-shadow:var(--dsw-elevation-soft),0 18px 40px -22px color-mix(in srgb,var(--dsw-alias-label-primary) 34%,transparent);left:var(--mgc-menu-left);top:var(--mgc-menu-top)}
      .mgc-select-option{display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:32px;padding:6px 10px;border-radius:9px;font-size:13px;cursor:pointer;outline-offset:-2px}
      .mgc-select-option:hover,.mgc-select-option:focus{background:var(--dsw-alias-interactive-bg-hover)}
      .mgc-select-option[aria-selected='true']{font-weight:600}
      .mgc-avatar{--mgc-avatar-hue:215;background:color-mix(in oklab,hsl(var(--mgc-avatar-hue) 70% 58%) 16%,var(--dsw-alias-bg-base));color:color-mix(in oklab,hsl(var(--mgc-avatar-hue) 72% 40%) 78%,var(--dsw-alias-label-primary));box-shadow:inset 0 0 0 1px color-mix(in oklab,hsl(var(--mgc-avatar-hue) 70% 58%) 24%,transparent);border-radius:10px}
      .mgc-member-dot{display:inline-block;width:8px;height:8px;margin-inline-end:6px;border-radius:50%;background:hsl(var(--mgc-avatar-hue) 70% 58%);box-shadow:0 0 0 3px color-mix(in oklab,hsl(var(--mgc-avatar-hue) 70% 58%) 16%,transparent)}
      .mgc-page .mgc-dialog{border-radius:20px;border-color:var(--dsw-alias-border-l3);box-shadow:0 24px 60px -24px color-mix(in srgb,var(--dsw-alias-label-primary) 42%,transparent),0 8px 24px -14px color-mix(in srgb,var(--dsw-alias-label-primary) 16%,transparent)}
      .mgc-dialog-head{padding:16px 18px 10px}.mgc-dialog-foot{padding:12px 18px 16px;border-top:.5px solid var(--dsw-alias-border-l3)}
      .mgc-editor{gap:14px;padding:16px 18px}
      .mgc-editor :is(input:not([type='checkbox']),select,textarea),.mgc-role-prompt{min-height:36px;padding:8px 12px;border:1px solid var(--dsw-alias-border-l3);border-radius:12px;background:color-mix(in srgb,var(--dsw-alias-bg-base) 94%,var(--dsw-alias-label-primary));transition:border-color .15s ease,box-shadow .15s ease,background-color .15s ease}
      .mgc-editor :is(input,select,textarea):hover:enabled{border-color:var(--dsw-alias-border-l4)}
      .mgc-editor :is(input:not([type='checkbox']),select,textarea):focus-visible{outline:0;border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--dsw-alias-state-business-primary) 22%,transparent)}
      .mgc-editor :is(input,select,textarea):disabled{opacity:.62}
      .mgc-options{padding:10px 12px;border-radius:14px;border-color:var(--dsw-alias-border-l3);background:color-mix(in srgb,var(--dsw-alias-bg-base) 96%,var(--dsw-alias-label-primary))}
      .mgc-catalog{gap:2px;padding:2px}
      .mgc-editor .mgc-choice{padding:6px 8px;border-radius:10px;transition:background-color .15s ease}
      .mgc-editor .mgc-choice:hover{background:var(--dsw-alias-interactive-bg-hover)}
      .mgc-dialog .mgc-primary,.mgc-dialog .mgc-quiet{min-height:34px;padding:0 14px;border-radius:11px}
      .mgc-role-prompt{min-height:82px;resize:vertical}.mgc-member{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);align-items:center;gap:8px;overflow-wrap:anywhere}.mgc-member>span{font-size:13px}
      @container (max-width:600px){.mgc-column{width:min(calc(100% - 28px),var(--mgc-chat-width,748px))}.mgc-header{padding-inline:12px}.mgc-settings-copy{display:none}.mgc-header-lead,.mgc-crumb{gap:5px}.mgc-member{grid-template-columns:1fr;gap:3px}.mgc-compose-progress{display:none}.mgc-small-select{max-width:min(180px,100%)}}
      @container (max-width:420px){.mgc-header .mgc-label-optional{display:none}}
      @media (pointer:coarse){.mgc-composer textarea,.mgc-editor input,.mgc-editor select{font-size:16px}}
    `;
    const fileModes = Object.freeze({ 'read-only': 'fileModeReadOnly', 'workspace-write': 'fileModeWorkspaceWrite', 'danger-full-access': 'fileModeFull' });
    const fileModeOf = room => Object.hasOwn(fileModes, room?.fileMode) ? room.fileMode : 'read-only';
    const hasProjectAccess = room => room?.capabilities?.projectAccess === true;
    const phaseOrder = ['ideas', 'review', 'summary', 'reply'];
    const emptyDraft = { text: '', recipient: '', freeTalk: false, identity: null };
    const errorCodes = new Set(Object.keys(en).filter(key => key.includes('-')));
    function errText(t, err, fallback = 'unknownRead') { return err && errorCodes.has(err.code) ? t(err.code) : t(fallback); }
    function Notice({ role = 'status', children }) { return h('div', { className: 'mgc-dim mgc-notice', role }, children); }
    function withRequestId(store, args, supported) {
      if (!supported) return args;
      const fingerprint = JSON.stringify(args);
      if (store.current?.fingerprint !== fingerprint) store.current = { fingerprint, id: crypto.randomUUID() };
      return { ...args, requestId: store.current.id };
    }
    function PanelIcon({ size = 18 }) {
      return h('svg', { width: size, height: size, viewBox: '0 0 20 20', fill: 'none', 'aria-hidden': true },
        h('path', { d: 'M14 13h2a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1m1 8v3l-3-3M4 3h8a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H7l-3 3v-3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z', stroke: 'currentColor', strokeWidth: 1.4, strokeLinejoin: 'round' }));
    }
    async function request(action, args = {}, signal) {
      const timeout = AbortSignal.timeout(20000);
      const response = await fetch('api/model-group-chat', { method: 'POST', credentials: 'same-origin',
        headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action, ...args }),
        signal: signal ? AbortSignal.any([signal, timeout]) : timeout });
      const payload = await response.json();
      if (!response.ok || payload.ok !== true) throw Object.assign(new Error('Group chat request failed'), { code: payload.error?.code });
      return payload.value;
    }
    const glyphs = {
      settings: 'M12 15.1a3.1 3.1 0 1 0 0-6.2 3.1 3.1 0 0 0 0 6.2ZM9.4 3l-.9 3-2.8.7-2.3 3.9 2 2.1-.3 2.9 2.3 2.3 2.9-.3 2.1 2 3.9-2.3.7-2.8 3-.9v-4.5l-3-.9-.7-2.8L12.4 3l-2.1 2Z',
      close: 'm6 6 12 12M6 18 18 6', plus: 'M12 5v14M5 12h14', back: 'm14 6-6 6 6 6', arrow: 'M12 19V5m-6 6 6-6 6 6',
      folder: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z',
      chevron: 'm6 9 6 6 6-6', stop: 'M8 8h8v8H8z', down: 'M12 5v14m-6-6 6 6 6-6', refresh: 'M19 8a8 8 0 1 0 .7 6M19 4v4h-4', sidebar: 'M4 5h16v14H4zM10 5v14',
      file: 'M6 3h8l4 4v14H6zM14 3v5h4M9 12h6m-6 4h6',
    };
    function Glyph({ name, size = 16 }) {
      return h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: name === 'stop' ? 'currentColor' : 'none', 'aria-hidden': true },
        h('path', { d: glyphs[name], stroke: 'currentColor', strokeWidth: 1.65, strokeLinejoin: 'round', strokeLinecap: 'round' }));
    }
    function Header({ t, title, workspaceTitle, onBack, children }) {
      const heading = useRef(null);
      useEffect(() => {
        if (document.activeElement === document.body) heading.current?.focus({ preventScroll: true });
      }, []);
      return h('header', { className: 'mgc-header' },
        h('div', { className: 'mgc-header-lead' },
          onBack && h('button', { type: 'button', className: 'mgc-icon-button', 'aria-label': t('back'), title: t('back'), onClick: onBack }, h(Glyph, { name: 'back' })),
          workspaceTitle && h('span', { className: 'mgc-crumb mgc-muted mgc-truncate', title: workspaceTitle }, workspaceTitle, h('span', { 'aria-hidden': true }, '/')),
          h('h1', { className: 'mgc-truncate', ref: heading, tabIndex: -1, title }, title)),
        h('div', { className: 'mgc-actions' }, children));
    }
    const settingsRolePresets = ['roleProductManager', 'roleDesigner', 'roleDeveloper', 'roleTester', 'roleArchitect', 'roleReviewer'];
    const rolePromptLimit = 1000;
    const emptyRoleDraft = { preset: '', label: '', customLabel: '', prompt: '' };
    function settingsRoleDrafts(room, t) {
      return Object.fromEntries(room.members.map(member => {
        const label = member.role ?? '';
        // Recognize preset labels saved in either locale, but preserve the exact
        // saved label and prompt unless the user edits them.
        const preset = label && (settingsRolePresets.find(key => [t(key), en[key], zh[key]].includes(label)) ?? 'custom');
        return [member.key, { preset, label, customLabel: label, prompt: member.rolePrompt ?? '' }];
      }));
    }
    function settingsSelectRole(role, preset, t) {
      const previousPromptKey = `${role.preset}Prompt`;
      const followsPreset = !role.prompt.trim() || (settingsRolePresets.includes(role.preset)
        && [t(previousPromptKey), en[previousPromptKey], zh[previousPromptKey]].includes(role.prompt.trim()));
      const builtIn = settingsRolePresets.includes(preset);
      return { ...role, preset, label: builtIn ? t(preset) : preset === 'custom' ? role.customLabel : '',
        prompt: followsPreset ? (builtIn ? t(`${preset}Prompt`) : '') : role.prompt };
    }
    function SettingsMember({ t, label, role, locked, onChange, order = -1, memberKey = '' }) {
      const countId = useId();
      const presetPrompt = settingsRolePresets.includes(role.preset) ? t(`${role.preset}Prompt`) : '';
      return h('fieldset', { className: 'mgc-options mgc-member-card', disabled: locked },
        h('legend', null, h('span', { className: 'mgc-member-dot', style: { '--mgc-avatar-hue': String(avatarHue(order, memberKey)) }, 'aria-hidden': true }), label),
        h('div', { className: 'mgc-field' }, h('span', { className: 'mgc-field-label' }, t('rolePreset')),
          h(Select, { value: role.preset, label: t('rolePreset'), disabled: locked,
            options: [{ value: '', label: t('roleNone') }, ...settingsRolePresets.map(preset => ({ value: preset, label: t(preset) })),
              { value: 'custom', label: t('roleCustom') }],
            onChange: next => onChange(settingsSelectRole(role, next, t)) })),
        role.preset === 'custom' && h('label', null, t('role'), h('input', { value: role.customLabel, maxLength: 120, placeholder: t('roleExample'),
          onChange: e => onChange({ ...role, label: e.target.value, customLabel: e.target.value }) })),
        h('label', null, t('rolePrompt'), h('textarea', { className: 'mgc-role-prompt', value: role.prompt,
          placeholder: t('rolePromptPlaceholder'), rows: 3, maxLength: rolePromptLimit, 'aria-describedby': countId,
          onChange: e => onChange({ ...role, prompt: e.target.value }) })),
        h('div', { className: 'mgc-role-prompt-actions' },
          h('span', { id: countId, className: 'mgc-muted' }, t('rolePromptCount', { count: role.prompt.length })),
          presetPrompt && h('button', { type: 'button', className: 'mgc-quiet', disabled: role.prompt === presetPrompt,
            onClick: () => onChange({ ...role, prompt: presetPrompt }) }, t('resetRolePrompt'))));
    }
    function ChatSettings({ t, room, directory, onSaved, onDismiss, onObserved }) {
      const heading = useId();
      const dlg = useRef(null);
      const original = useRef(room);
      const [title, setTitle] = useState(room.isDraft ? (room.title === 'New group chat' ? '' : room.title) : room.title);
      const [keys, setKeys] = useState(room.memberKeys);
      const [roles, setRoles] = useState(() => settingsRoleDrafts(room, t));
      const [moderator, setModerator] = useState(room.moderatorKey ?? '');
      const [writer, setWriter] = useState(room.writerKey ?? '');
      const [filter, setFilter] = useState('');
      const [catalog, setCatalog] = useState(null);
      const [load, setLoad] = useState(0);
      const [loading, setLoading] = useState(true);
      const [busy, setBusy] = useState(false);
      const [applyingMode, setApplyingMode] = useState(false);
      const [modeDraft, setModeDraft] = useState(null);
      const [fullConfirmed, setFullConfirmed] = useState(false);
      const [modeStatus, setModeStatus] = useState(null);
      const [error, setError] = useState(null);
      const [catalogError, setCatalogError] = useState(null);
      const [latest, setLatest] = useState(null);
      const [checking, setChecking] = useState(false);
      const [checkError, setCheckError] = useState(null);
      const inspection = useRef(null);
      const sending = useRef(null);
      useLayoutEffect(() => {
        const dialog = dlg.current;
        if (!dialog.open) dialog.showModal();
        return () => { if (dialog.open) dialog.close(); };
      }, []);
      useEffect(() => {
        const ctl = new AbortController();
        setLoading(true); setCatalogError(null);
        request('snapshot', {}, ctl.signal).then(result => {
          if (!ctl.signal.aborted) setCatalog(result);
        }).catch(err => { if (!ctl.signal.aborted) setCatalogError(err); })
          .finally(() => { if (!ctl.signal.aborted) setLoading(false); });
        return () => ctl.abort();
      }, [load]);
      useEffect(() => () => { sending.current?.abort(); inspection.current?.abort(); }, []);
      const available = catalog?.models ?? [];
      const byKey = new Map(available.map(model => [model.key, model]));
      const known = new Map([...original.current.members.map(model => [model.key, model]), ...byKey]);
      const folderTitle = room.folderTitle ?? directory?.workspaces.find(item => item.id === room.workspaceId)?.title
        ?? catalog?.workspaces?.find(item => item.id === room.workspaceId)?.title;
      const options = [...known.values()].filter(model => `${model.label} ${model.model ?? ''} ${model.provider ?? ''}`.toLowerCase().includes(filter.trim().toLowerCase()));
      const locked = busy || room.active || room.storageFailed;
      const currentMode = fileModeOf(room);
      const selectedMode = modeDraft?.revision === room.revision ? modeDraft.mode : currentMode;
      const canApplyMode = hasProjectAccess(room) && !locked && !checking && !latest && selectedMode !== currentMode
        && (selectedMode !== 'danger-full-access' || fullConfirmed);
      // The old configure endpoint would not persist role prompts. Do not silently
      // discard them when this client loads against an older host.
      const caps = catalog?.capabilities;
      const supported = caps?.configure === true && (caps.draftRooms === true || caps.rolePrompts === true);
      const needReview = latest || error?.code === 'stale-revision' || Boolean(error && !error.code);
      const name = title.trim() || (original.current.isDraft ? t('untitledGroup') : '');
      const valid = !locked && !loading && !catalogError && !checking && !needReview && supported && Boolean(name)
        && keys.length >= 1 && keys.length <= 4 && (!moderator || keys.includes(moderator)) && (!writer || keys.includes(writer)) && keys.every(key => byKey.has(key));
      async function inspectLatest() {
        if (inspection.current) return;
        const ctl = new AbortController(); inspection.current = ctl; setChecking(true); setCheckError(null);
        try {
          const current = await request('room', { roomId: room.id }, ctl.signal);
          if (!ctl.signal.aborted) { setLatest(current); onObserved?.(current); }
        } catch (err) { if (!ctl.signal.aborted) setCheckError(err); }
        finally { inspection.current = null; if (!ctl.signal.aborted) setChecking(false); }
      }
      function resumeEditing(useLatest) {
        original.current = latest;
        if (useLatest) {
          setTitle(latest.isDraft ? '' : latest.title); setKeys(latest.memberKeys); setModerator(latest.moderatorKey ?? '');
          setWriter(latest.writerKey ?? '');
          setRoles(settingsRoleDrafts(latest, t));
        } else if (!title.trim() && !latest.isDraft) {
          // An untouched draft name is the localized default, even if a
          // concurrent configure has already made the stored room non-draft.
          setTitle(name);
        }
        setLatest(null); setError(null); setCheckError(null);
      }
      function toggle(key, checked) {
        if (checked && keys.length >= 4) return;
        setKeys(checked ? [...keys, key] : keys.filter(value => value !== key));
        if (!checked && key === moderator) setModerator('');
        if (!checked && key === writer) setWriter('');
      }
      async function applyFileMode() {
        if (!canApplyMode || sending.current) return;
        const ctl = new AbortController(); sending.current = ctl; setBusy(true); setApplyingMode(true); setModeStatus(null);
        setModeDraft(null); setFullConfirmed(false);
        try {
          const next = await request('set-file-mode', {
            roomId: room.id, expectedRevision: room.revision, mode: selectedMode,
            ...(selectedMode === 'danger-full-access' ? { confirmFull: true } : {}),
          }, ctl.signal);
          if (!ctl.signal.aborted) {
            // Advance the unrelated settings form only from the exact revision we edited.
            if (original.current.revision === room.revision && next.revision === room.revision + 1) original.current = next;
            onObserved?.(next);
            setModeStatus({ saved: true });
          }
        } catch (err) {
          if (!ctl.signal.aborted) {
            setModeStatus({ err });
            await inspectLatest();
          }
        } finally { sending.current = null; if (!ctl.signal.aborted) { setBusy(false); setApplyingMode(false); } }
      }
      async function save(event) {
        event.preventDefault();
        if (!valid || sending.current) return;
        const ctl = new AbortController(); sending.current = ctl; setBusy(true); setError(null);
        const roleValues = field => Object.fromEntries(keys.flatMap(key => {
          const value = roles[key]?.[field].trim();
          return value ? [[key, value]] : [];
        }));
        try {
          const next = await request('configure', {
            title: name, memberKeys: keys, ...(moderator ? { moderatorKey: moderator } : {}),
            ...(caps?.writerAssignment ? { writerKey: writer || null } : {}),
            roles: roleValues('label'), rolePrompts: roleValues('prompt'),
            roomId: original.current.id, expectedRevision: original.current.revision,
          }, ctl.signal);
          if (!ctl.signal.aborted) onSaved(next);
        } catch (err) { if (!ctl.signal.aborted) setError(err); }
        finally { sending.current = null; if (!ctl.signal.aborted) setBusy(false); }
      }
      return h('dialog', { className: 'mgc-dialog', ref: dlg, 'aria-labelledby': heading,
        onCancel: event => { event.preventDefault(); if (!busy) onDismiss(); } },
        h('div', { className: 'mgc-dialog-head' }, h('h2', { id: heading }, t('settings')),
          h('button', { type: 'button', className: 'mgc-icon-button', 'aria-label': t('close'), disabled: busy, onClick: onDismiss }, h(Glyph, { name: 'close' }))),
        h('form', { onSubmit: save },
          h('div', { className: 'mgc-editor' },
            h('label', null, t('name'), h('input', { value: title, onChange: e => setTitle(e.target.value), maxLength: 80,
              placeholder: original.current.isDraft && original.current.title === 'New group chat' ? t('untitledGroup') : undefined, required: !original.current.isDraft, disabled: locked })),
            folderTitle && h('p', { className: 'mgc-muted' }, `${t('folderLabel')}: ${folderTitle}`),
            hasProjectAccess(room) && h('fieldset', { className: 'mgc-options mgc-file-mode', disabled: locked || checking || Boolean(latest) },
              h('legend', null, t('fileAccess')),
              h('div', { className: 'mgc-field' }, h('span', { className: 'mgc-field-label' }, t('fileAccessCurrent', { mode: t(fileModes[currentMode]) })),
                h(Select, { value: selectedMode, label: t('fileAccess'), disabled: locked || checking || Boolean(latest),
                  options: Object.entries(fileModes).map(([option, key]) => ({ value: option, label: t(key) })),
                  onChange: next => {
                    setModeDraft({ mode: next, revision: room.revision }); setFullConfirmed(false); setModeStatus(null);
                  } })),
              h('p', { className: 'mgc-muted' }, t('fileAccessScope')),
              room.active && h('p', { className: 'mgc-muted' }, t('fileModeBusy')),
              selectedMode === 'danger-full-access' && h(Notice, null, h('p', null, t('fileFullWarning')),
                selectedMode !== currentMode && h('label', { className: 'mgc-file-confirm' },
                  h('input', { type: 'checkbox', checked: fullConfirmed, onChange: event => setFullConfirmed(event.target.checked) }), t('confirmFullFileMode'))),
              h('div', null, h('button', { type: 'button', className: 'mgc-quiet', disabled: !canApplyMode, onClick: applyFileMode }, t(applyingMode ? 'applyingFileMode' : 'applyFileMode'))),
              modeStatus?.saved && h(Notice, null, t('fileModeSaved')),
              modeStatus?.err && h(Notice, { role: 'alert' }, errText(t, modeStatus.err, 'unknownFileMode'))),
            loading && h(Notice, null, t('loading')),
            catalogError && h(Notice, { role: 'alert' }, errText(t, catalogError), ' ', h('button', { type: 'button', className: 'mgc-quiet', onClick: () => setLoad(n => n + 1) }, t('retry'))),
            catalog && !supported && h(Notice, null, t('settingsUnsupported')),
            room.active && h(Notice, null, t('room-busy')),
            room.storageFailed && h(Notice, null, t('storageFailed')),
            catalog?.catalogWarnings?.length > 0 && h(Notice, null, `${t('catalogWarning')}: ${catalog.catalogWarnings.join(', ')}`),
            !loading && catalog && available.length === 0 && h(Notice, null, t('noModels')),
            !loading && catalog && keys.some(key => !byKey.has(key)) && h(Notice, null, t('model-unavailable')),
            h('fieldset', { className: 'mgc-options', disabled: locked || loading },
              h('legend', null, t('members'), ' ', h('span', { className: 'mgc-muted', role: 'status' }, `${keys.length}/4`)),
              h('label', null, t('filter'), h('input', { type: 'search', value: filter, onChange: e => setFilter(e.target.value) })),
              catalog && !catalogError && h('button', { type: 'button', className: 'mgc-quiet', onClick: () => setLoad(n => n + 1) },
                h(Glyph, { name: 'refresh' }), t('refresh')),
              options.length > 0 ? h('div', { className: 'mgc-catalog' }, options.map(model => h('label', { className: 'mgc-choice', key: model.key },
                h('input', { type: 'checkbox', checked: keys.includes(model.key), onChange: e => toggle(model.key, e.target.checked),
                  disabled: !keys.includes(model.key) && (keys.length >= 4 || !byKey.has(model.key)) }),
                h('span', null, model.label, catalog && !byKey.has(model.key) ? ` · ${t('unavailableModel')}` : ''))))
                : !loading && Boolean(filter.trim()) && h('p', { className: 'mgc-muted' }, t('noResults'))),
            h('div', { className: 'mgc-field' }, h('span', { className: 'mgc-field-label' }, t('moderator')),
              h(Select, { value: moderator, label: t('moderator'), disabled: locked || !keys.length,
                options: [{ value: '', label: t('noModerator') }, ...keys.map(key => ({ value: key, label: known.get(key)?.label ?? key }))],
                onChange: setModerator })),
            caps?.writerAssignment && hasProjectAccess(room) && h(Fragment, null,
              h('div', { className: 'mgc-field' }, h('span', { className: 'mgc-field-label' }, t('writerMember')),
                h(Select, { value: writer, label: t('writerMember'), disabled: locked || !keys.length,
                  options: [{ value: '', label: t('writerUnassigned') }, ...keys.map(key => ({ value: key, label: known.get(key)?.label ?? key }))],
                  onChange: setWriter })),
              h('p', { className: 'mgc-muted' }, t('writerNote'))),
            keys.length > 0 && h('div', { className: 'mgc-members' },
              h('p', { className: 'mgc-muted' }, t('roleHint')),
              keys.map((key, order) => h(SettingsMember, { key, t, label: known.get(key)?.label ?? key, role: roles[key] ?? emptyRoleDraft,
                locked, order, memberKey: key, onChange: role => setRoles(prev => ({ ...prev, [key]: role })) }))),
            error && h(Notice, { role: 'alert' }, errText(t, error, 'unknownSave'),
              !latest && h('button', { type: 'button', className: 'mgc-quiet', disabled: checking, onClick: inspectLatest }, t(checking ? 'loading' : 'latest'))),
            checkError && h(Notice, { role: 'alert' }, errText(t, checkError)),
            latest && h(Notice, null,
              h('p', null, t('staleNote')), h('p', null, `${t('currentTitle')}: ${latest.isDraft && latest.title === 'New group chat' ? t('untitledGroup') : latest.title}`),
              h('p', null, `${t('currentMembers')}: ${latest.members.map(member => `${member.label}${member.role ? ` · ${member.role}` : ''}`).join(' / ')}`),
              h('p', null, `${t('moderator')}: ${latest.members.find(member => member.key === latest.moderatorKey)?.label ?? t('noModerator')}`),
              caps?.writerAssignment && h('p', null, `${t('writerMember')}: ${latest.members.find(member => member.key === latest.writerKey)?.label ?? t('writerUnassigned')}`),
              h('button', { type: 'button', className: 'mgc-quiet', onClick: () => resumeEditing(true) }, t('discard')),
              h('button', { type: 'button', className: 'mgc-quiet', onClick: () => resumeEditing(false) }, t('rebase')))),
          h('div', { className: 'mgc-dialog-foot' },
            h('button', { type: 'button', className: 'mgc-quiet', disabled: busy, onClick: onDismiss }, t('close')),
            h('button', { type: 'submit', className: 'mgc-primary', disabled: !valid }, t(busy ? 'saving' : 'save')))));
    }
    function RichMessage({ text, renderFactorySlot }) {
      const fallback = h('div', { className: 'mgc-plain' }, text);
      // External/reference-bearing text stays inert. This workspace-bound chat
      // does not have a native Session file or browser delegate.
      if (!renderFactorySlot || /[\[\]<>]|https?:\/\//i.test(text)) return fallback;
      return renderFactorySlot('conversation.chat.reasoning.content', { text, running: false }, { fallback });
    }
    function hueOf(seed) {
      let hash = 2166136261;
      for (const character of String(seed ?? '')) { hash ^= character.codePointAt(0); hash = Math.imul(hash, 16777619); }
      return Math.abs(hash) % 360;
    }
    function avatarHue(order, key) {
      // Golden-angle spacing keeps two to four members visibly distinct.
      return Math.round(order >= 0 ? (205 + order * 137.508) % 360 : hueOf(key));
    }
    function Entry({ t, entry, renderFactorySlot, order = -1 }) {
      const initial = Array.from(entry.label.trim())[0]?.toLocaleUpperCase() || '·';
      return h('div', { className: 'mgc-bot', 'data-phase': entry.phase }, h('span', { className: 'mgc-avatar',
        style: { '--mgc-avatar-hue': String(avatarHue(order, entry.modelKey)) }, 'aria-hidden': true }, initial),
        h('div', { className: 'mgc-bot-content' },
          h('div', { className: 'mgc-message-meta' }, h('strong', null, entry.label), entry.recipientLabel && h('span', { className: 'mgc-muted' }, ` → ${entry.recipientLabel}`),
            entry.role && h('span', { className: 'mgc-role' }, entry.role),
            entry.phase === 'summary' && h('span', { className: 'mgc-role' }, t('moderator')),
            h('span', { className: 'mgc-muted' }, t(entry.phase)),
            entry.status !== 'completed' && h('span', { className: 'mgc-muted' }, t(entry.status))),
          h('div', { className: 'mgc-bot-bubble' }, entry.text
            ? h('div', { className: 'mgc-prose' }, h(RichMessage, { text: entry.text, renderFactorySlot }))
            : h('div', { className: 'mgc-muted' }, entry.code && Object.hasOwn(en, entry.code) ? t(entry.code) : t(entry.status === 'running' ? 'working' : 'noAnswer')))));
    }
    function Turn({ t, turn, renderFactorySlot, members }) {
      const direct = turn.recipientKey && (turn.members?.find(m => m.key === turn.recipientKey)?.label
        ?? turn.entries.find(e => e.modelKey === turn.recipientKey)?.label ?? members.find(m => m.key === turn.recipientKey)?.label);
      const timestamp = new Date(turn.createdAt).toLocaleString();
      const roster = turn.members ?? members;
      const orderOf = modelKey => roster.findIndex(member => member.key === modelKey);
      const entries = phase => turn.entries.filter(e => e.phase === phase).map(entry => h(Entry, {
        key: entry.modelKey, entry, t, renderFactorySlot, order: orderOf(entry.modelKey) }));
      const reviews = entries('review');
      const reviewFailures = turn.entries.filter(e => e.phase === 'review' && e.status === 'failed').length;
      return h('article', null,
        h('div', { className: 'mgc-user' },
          h('div', { className: 'mgc-muted' }, t('me'), direct ? ` → ${direct}` : '', ' · ', h('time', { dateTime: turn.createdAt }, timestamp)),
          h('div', { className: 'mgc-user-bubble' }, turn.text),
          turn.fileAccessed === true && h('p', { className: 'mgc-muted' }, t('fileAccessed')),
          turn.project?.files?.length > 0 && h('details', { className: 'mgc-project-context', open: false },
            h('summary', null, h('bdi', null, `${turn.project.name} · ${t('projectContext')}`)),
            turn.project.files.map(file => h('div', { className: 'mgc-project-excerpt', key: file.path },
              h('strong', null, file.path), file.truncated && h('span', { className: 'mgc-muted' }, ` · ${t('truncatedExcerpt')}`),
              h('pre', null, file.text))))),
        entries('ideas'), reviews.length > 0 && h('details', { open: turn.phase === 'review' || reviewFailures > 0 || undefined },
          h('summary', null, `${t('review')} (${reviews.length})${reviewFailures ? ` · ${t('failed')} ${reviewFailures}` : ''}`), reviews),
        turn.entries.flatMap((entry, i) => entry.phase === 'dialogue' || entry.phase === 'change-review'
          ? [h(Entry, { key: `follow-up-${i}`, entry, t, renderFactorySlot, order: orderOf(entry.modelKey) })] : []),
        entries('summary'), entries('reply'),
        turn.dialogueLimit && h(Notice, null, t('dialogueLimit')),
        ['partial', 'failed', 'cancelled', 'interrupted'].includes(turn.status) && h(Notice, null, t(turn.status)));
    }
    function openTop(node) { if (node) node.scrollTop = node.scrollHeight; }
    const WIDTH_KEY = 'dsh.modelGroupChat.contentWidth';
    const WIDTH_MIN = 640;
    const WIDTH_GUTTER = 96;
    const WIDTH_MAX = 1800;
    function widthPreference(storage) {
      let value = null;
      try {
        const raw = Number(storage?.getItem(WIDTH_KEY));
        if (Number.isInteger(raw) && raw >= WIDTH_MIN && raw <= WIDTH_MAX) value = raw;
      } catch { /* Preferences remain usable even when browser storage is unavailable. */ }
      return { get: () => value, geometry: widthGeometry, set(next) {
        if (next !== null && (!Number.isInteger(next) || next < WIDTH_MIN || next > WIDTH_MAX)) return;
        value = next;
        try { if (next === null) storage?.removeItem(WIDTH_KEY); else storage?.setItem(WIDTH_KEY, String(next)); } catch { /* session-local */ }
      } };
    }
    function widthGeometry(column, preferred) {
      const max = Math.min(WIDTH_MAX, Math.floor(column) - WIDTH_GUTTER);
      if (max <= WIDTH_MIN) return { width: Math.max(1, Math.floor(column) - 36), min: null, max: null };
      const defaultWidth = Math.min(920, Math.max(680, Math.round(column * .64)));
      return { width: Math.max(WIDTH_MIN, Math.min(max, preferred ?? defaultWidth)), min: WIDTH_MIN, max };
    }
    function ConversationFrame({ t, scroll, scrollId, following, preferences, children }) {
      const root = useRef(null);
      const [column, setColumn] = useState(0);
      const [saved, setSaved] = useState(preferences.get);
      const [preview, setPreview] = useState(null);
      const dragging = useRef(null);
      const focused = useRef(null);
      useLayoutEffect(() => {
        const node = root.current;
        const update = () => setColumn(Math.round(node.clientWidth));
        update();
        if (typeof ResizeObserver !== 'function') {
          window.addEventListener('resize', update);
          return () => window.removeEventListener('resize', update);
        }
        const observer = new ResizeObserver(update);
        observer.observe(node);
        return () => observer.disconnect();
      }, []);
      const geometry = widthGeometry(column || 960, preview?.width ?? saved);
      const adjustable = column > 0 && geometry.min !== null;
      useLayoutEffect(() => { if (following.current) openTop(scroll.current); }, [geometry.width]);
      function commit(value) { preferences.set(value); setSaved(preferences.get()); }
      function candidate(value) { return Math.round(Math.min(geometry.max, Math.max(geometry.min, value))); }
      function finish(event, keep, side) {
        const gesture = dragging.current;
        if (!gesture || gesture.pointerId !== event.pointerId) return;
        dragging.current = null;
        if (keep && adjustable && gesture.x !== event.clientX) {
          const next = candidate(gesture.width + (event.clientX - gesture.x) * 2 * (side === 'right' ? 1 : -1));
          if (next !== gesture.width) commit(next);
        }
        setPreview(null);
      }
      useLayoutEffect(() => {
        if (adjustable) return;
        if (dragging.current) { dragging.current = null; setPreview(null); }
        if (focused.current && document.activeElement === document.body) scroll.current?.focus({ preventScroll: true });
        focused.current = null;
      }, [adjustable]);
      function handle(side) {
        return h('div', { className: 'mgc-resize', key: side, 'data-side': side, 'data-dragging': preview?.side === side || undefined,
          role: 'separator', tabIndex: 0, title: t('widthHelp'), 'aria-label': t(side === 'left' ? 'widthLeft' : 'widthRight'), 'aria-orientation': 'vertical', 'aria-controls': scrollId,
          onFocus: e => { focused.current = e.currentTarget; }, onBlur: e => { if (e.currentTarget.isConnected) focused.current = null; },
          'aria-valuemin': geometry.min, 'aria-valuemax': geometry.max, 'aria-valuenow': geometry.width, 'aria-valuetext': t('widthValue', { width: geometry.width }),
          onPointerDown: e => {
            if (e.button !== 0 || dragging.current) return;
            e.preventDefault();
            e.currentTarget.focus({ preventScroll: true });
            e.currentTarget.setPointerCapture(e.pointerId);
            dragging.current = { pointerId: e.pointerId, x: e.clientX, width: geometry.width };
            setPreview({ side, width: geometry.width });
          },
          onPointerMove: e => {
            const gesture = dragging.current;
            if (!gesture || gesture.pointerId !== e.pointerId) return;
            const width = candidate(gesture.width + (e.clientX - gesture.x) * 2 * (side === 'right' ? 1 : -1));
            setPreview(prev => prev?.width === width ? prev : { side, width });
          },
          onPointerUp: e => finish(e, true, side), onPointerCancel: e => finish(e, false, side), onLostPointerCapture: e => finish(e, false, side),
          onDoubleClick: () => commit(null),
          onKeyDown: e => {
            if (e.ctrlKey || e.altKey || e.metaKey || dragging.current) return;
            const direction = side === 'right' ? 1 : -1;
            const step = e.shiftKey ? 80 : 24;
            let next;
            if (e.key === 'ArrowRight') next = candidate(geometry.width + step * direction);
            else if (e.key === 'ArrowLeft') next = candidate(geometry.width - step * direction);
            else if (e.key === 'Home') next = geometry.min;
            else if (e.key === 'End') next = geometry.max;
            else if (e.key === 'Delete') next = null;
            else return;
            e.preventDefault(); if (next === null || next !== geometry.width) commit(next);
          },
          onWheel: e => {
            const node = scroll.current;
            if (!node || e.ctrlKey || !e.deltaY) return;
            node.scrollTop += e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? node.clientHeight : 1);
          },
        });
      }
      return h('div', { className: 'mgc-conversation', ref: root, 'data-resizing': Boolean(preview) || undefined,
        style: column ? { '--mgc-chat-width': `${geometry.width}px` } : undefined },
        h('div', { className: 'mgc-message-area' }, children[0], adjustable && ['left', 'right'].map(handle)), children[1]);
    }
    function canApproveFileChange(approval) {
      return typeof approval.path === 'string' && approval.path.length > 0 && typeof approval.newText === 'string'
        && (approval.operation === 'create' || (approval.operation === 'edit' && typeof approval.oldText === 'string'));
    }
    function FileApproval({ t, approval, deciding, stopping, onDecide, onStop, error, reviewSharing }) {
      const heading = useId();
      const exact = canApproveFileChange(approval);
      const diff = (label, text) => h('div', { className: 'mgc-file-diff' }, h('span', { className: 'mgc-muted' }, t(label)),
        typeof text === 'string' && h('pre', { tabIndex: 0, 'aria-label': t(label) }, text));
      return h('section', { className: 'mgc-file-approval', 'aria-labelledby': heading },
        h('div', { role: 'status' }, h('h2', { id: heading }, t('fileApproval')),
          h('p', { className: 'mgc-muted' }, t(exact ? 'fileApprovalExact' : 'fileApprovalIncomplete'))),
        h('div', null, (approval.operation === 'edit' || approval.operation === 'create') &&
          `${t(approval.operation === 'edit' ? 'fileApprovalEdit' : 'fileApprovalCreate')}: `,
          h('code', { className: 'mgc-file-approval-path', dir: 'auto' }, approval.path)),
        exact && approval.operation === 'edit' && diff('fileApprovalBefore', approval.oldText),
        exact && diff(approval.operation === 'edit' ? 'fileApprovalAfter' : 'fileApprovalNew', approval.newText),
        reviewSharing && h('p', { className: 'mgc-muted' }, t('reviewSharing')),
        error && h(Notice, { role: 'alert' }, errText(t, error, 'unknownFileDecision')),
        h('div', { className: 'mgc-file-approval-actions' },
          deciding && h('span', { className: 'mgc-muted', role: 'status' }, t('decidingFileWrite')),
          h('button', { type: 'button', className: 'mgc-quiet', disabled: stopping, onClick: onStop }, t(stopping ? 'stopping' : 'cancel')),
          h('button', { type: 'button', className: 'mgc-quiet', disabled: deciding || stopping, onClick: () => onDecide(approval.id, false) }, t('rejectFileWrite')),
          h('button', { type: 'button', className: 'mgc-primary', disabled: !exact || deciding || stopping, onClick: () => onDecide(approval.id, true) }, t('approveFileWrite'))));
    }
    // A native <select> popup is painted by the platform, so its list cannot take
    // the theme radius. This control renders the list itself, in the top layer.
    function Select({ value, options, onChange, disabled = false, label }) {
      const listId = useId(), root = useRef(null), trigger = useRef(null), menu = useRef(null), items = useRef([]);
      const [open, setOpen] = useState(false);
      const [active, setActive] = useState(0);
      const selected = options.findIndex(option => option.value === value);
      const current = options[selected >= 0 ? selected : 0];
      const close = (restore = false) => { setOpen(false); if (restore) trigger.current?.focus({ preventScroll: true }); };
      const choose = next => { onChange(next); close(true); };
      useEffect(() => {
        if (!open) return;
        function outside(event) {
          if (root.current?.contains(event.target) || menu.current?.contains(event.target)) return;
          setOpen(false);
        }
        document.addEventListener('pointerdown', outside, true);
        return () => document.removeEventListener('pointerdown', outside, true);
      }, [open]);
      useEffect(() => { if (disabled) setOpen(false); }, [disabled]);
      useLayoutEffect(() => {
        const popup = menu.current, button = trigger.current;
        if (!open || !popup || !button || typeof popup.showPopover !== 'function') return;
        function place() {
          const rect = button.getBoundingClientRect();
          const view = document.documentElement;
          const width = Math.min(Math.max(rect.width, 180), view.clientWidth - 16);
          popup.style.setProperty('--mgc-menu-width', `${width}px`);
          const left = getComputedStyle(button).direction === 'rtl' ? rect.right - width : rect.left;
          popup.style.setProperty('--mgc-menu-left', `${Math.max(8, Math.min(left, view.clientWidth - width - 8))}px`);
          const height = Math.min(240, popup.scrollHeight || 0);
          const above = rect.top >= height + 8 && rect.bottom + height + 8 > view.clientHeight;
          const top = above ? rect.top - height - 6 : Math.min(rect.bottom + 6, view.clientHeight - height - 8);
          popup.style.setProperty('--mgc-menu-height', `${height}px`);
          popup.style.setProperty('--mgc-menu-top', `${Math.max(8, top)}px`);
        }
        popup.showPopover();
        place();
        window.addEventListener('resize', place);
        document.addEventListener('scroll', place, true);
        return () => {
          window.removeEventListener('resize', place);
          document.removeEventListener('scroll', place, true);
          if (popup.matches(':popover-open')) popup.hidePopover();
        };
      }, [open, options.length]);
      useLayoutEffect(() => {
        if (open) items.current[Math.min(active, options.length - 1)]?.focus({ preventScroll: true });
      }, [open, active, options.length]);
      function begin() { setActive(selected >= 0 ? selected : 0); setOpen(true); }
      function keys(event) {
        if (event.key === 'Tab') { setOpen(false); return; }
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(true); return; }
        const focused = Math.min(active, options.length - 1);
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(options[focused].value); return; }
        let next;
        if (event.key === 'ArrowDown') next = (focused + 1) % options.length;
        else if (event.key === 'ArrowUp') next = (focused + options.length - 1) % options.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = options.length - 1;
        if (next !== undefined) { event.preventDefault(); setActive(next); }
      }
      return h('div', { className: 'mgc-select', ref: root },
        h('button', { type: 'button', ref: trigger, className: 'mgc-select-trigger', disabled,
          'aria-haspopup': 'listbox', 'aria-expanded': open, 'aria-label': label, 'aria-controls': open ? listId : undefined,
          onClick: () => (open ? close() : begin()),
          onKeyDown: event => { if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); begin(); } } },
          h('span', { className: 'mgc-truncate' }, current?.label ?? ''), h(Glyph, { name: 'chevron', size: 13 })),
        open && h('div', { id: listId, ref: menu, popover: 'manual', role: 'listbox', 'aria-label': label,
          className: 'mgc-select-menu', onKeyDown: keys },
          options.map((option, i) => h('div', { key: `${i}:${option.value}`, role: 'option', 'aria-selected': option.value === value,
            tabIndex: i === Math.min(active, options.length - 1) ? 0 : -1, className: 'mgc-select-option', title: option.label,
            ref: node => { items.current[i] = node; }, onClick: () => choose(option.value) },
            h('span', { className: 'mgc-truncate' }, option.label), option.value === value && h('span', { 'aria-hidden': true }, '✓')))));
    }
    function RecipientPicker({ t, members, value, onChange, disabled }) {
      const listId = useId(), root = useRef(null), trigger = useRef(null), menu = useRef(null), optionsRef = useRef([]);
      const [open, setOpen] = useState(false), [index, setIndex] = useState(0);
      const choices = [{ key: '', name: t('everyone') }, ...members.map(m => ({
        key: m.key, name: `@ ${m.label}${m.role ? ` · ${m.role}` : ''}`,
      }))];
      const selected = choices.findIndex(choice => choice.key === value);
      const label = choices[selected]?.name ?? t('unavailableModel');
      const close = (restore = false) => { setOpen(false); if (restore) trigger.current?.focus({ preventScroll: true }); };
      useEffect(() => {
        if (!open) return;
        function outside(event) { if (!root.current?.contains(event.target)) setOpen(false); }
        document.addEventListener('pointerdown', outside, true);
        return () => document.removeEventListener('pointerdown', outside, true);
      }, [open]);
      useEffect(() => { if (disabled) setOpen(false); }, [disabled]);
      useLayoutEffect(() => {
        const popup = menu.current, button = trigger.current;
        if (!open || !popup || !button || typeof popup.showPopover !== 'function') return;
        function position(event) {
          if (event?.target instanceof Node && popup.contains(event.target)) return;
          const rect = button.getBoundingClientRect();
          const { clientWidth, clientHeight } = document.documentElement;
          const above = Math.max(0, rect.top - 14), below = Math.max(0, clientHeight - rect.bottom - 14);
          const height = Math.min(220, Math.max(above, below));
          const width = Math.min(360, Math.max(rect.width, 220), clientWidth - 16);
          const left = getComputedStyle(button).direction === 'rtl' ? rect.right - width : rect.left;
          popup.style.setProperty('--mgc-menu-width', `${width}px`);
          popup.style.setProperty('--mgc-menu-height', `${height}px`);
          popup.style.setProperty('--mgc-menu-left', `${Math.max(8, Math.min(left, clientWidth - width - 8))}px`);
          const useAbove = above >= Math.min(220, popup.scrollHeight + 2) || above >= below;
          const top = useAbove ? rect.top - popup.offsetHeight - 6 : rect.bottom + 6;
          popup.style.setProperty('--mgc-menu-top', `${Math.max(8, top)}px`);
        }
        popup.showPopover();
        position();
        window.addEventListener('resize', position);
        document.addEventListener('scroll', position, true);
        return () => {
          window.removeEventListener('resize', position);
          document.removeEventListener('scroll', position, true);
          if (popup.matches(':popover-open')) popup.hidePopover();
        };
      }, [open, choices.length]);
      useLayoutEffect(() => { if (open) optionsRef.current[Math.min(index, choices.length - 1)]?.focus(); }, [open, index, choices.length]);
      function begin(fallback) { setIndex(selected >= 0 ? selected : fallback); setOpen(true); }
      function choose(key) { onChange(key); close(true); }
      function onKeys(event) {
        if (event.key === 'Tab') return;
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(true); return; }
        const focused = Math.min(index, choices.length - 1);
        let next;
        if (event.key === 'ArrowDown') next = (focused + 1) % choices.length;
        else if (event.key === 'ArrowUp') next = (focused + choices.length - 1) % choices.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = choices.length - 1;
        else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(choices[focused].key); return; }
        if (next !== undefined) { event.preventDefault(); setIndex(next); }
      }
      return h('div', { className: 'mgc-recipient', ref: root, onBlur: event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      } },
        h('button', { type: 'button', className: 'mgc-recipient-trigger', ref: trigger, disabled,
          title: label, 'aria-label': `${t('recipient')}: ${label}`, 'aria-haspopup': 'listbox', 'aria-expanded': open,
          'aria-controls': open ? listId : undefined, onClick: () => open ? close() : begin(0),
          onKeyDown: event => { if (open && event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(true); }
            else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault(); begin(event.key === 'ArrowDown' ? 0 : choices.length - 1);
          } } }, selected <= 0 && h('span', { 'aria-hidden': true }, '@'), h('span', { className: 'mgc-truncate' }, label), h(Glyph, { name: 'chevron', size: 13 })),
        open && h('div', { id: listId, ref: menu, popover: 'manual', role: 'listbox', 'aria-label': t('recipient'), className: 'mgc-recipient-menu', onKeyDown: onKeys },
          choices.map((choice, i) => h('div', { key: choice.key, role: 'option', 'aria-selected': choice.key === value,
            tabIndex: i === Math.min(index, choices.length - 1) ? 0 : -1, className: 'mgc-recipient-option', title: choice.name,
            ref: node => { optionsRef.current[i] = node; }, onClick: () => choose(choice.key) },
            h('span', { className: 'mgc-truncate' }, choice.name), choice.key === value && h('span', { 'aria-hidden': true }, '✓')))));
    }
    function RoomView({ t, id, seed, workspaceTitle, onRoom, onBack, drafts, navigation, directory, renderFactorySlot }) {
      const scrollId = useId();
      const [room, setRoom] = useState(seed ?? null);
      const [draftState, setDraftState] = useState(() => drafts.get(id) ?? emptyDraft);
      const { text: draft, recipient } = draftState;
      const editor = useRef(null), settings = useRef(null), folderControl = useRef(null), stopFocus = useRef(false), scroll = useRef(null), following = useRef(true), composing = useRef(false);
      const [showJump, setShowJump] = useState(false);
      const [older, setOlder] = useState(false);
      const [action, setAction] = useState(null);
      const [readError, setReadError] = useState(null);
      const [actionError, setActionError] = useState(null);
      const [reload, setReload] = useState(0);
      const [showSettings, setSettings] = useState(false);
      const [choosingFolder, setChoosingFolder] = useState(false);
      const [folderError, setFolderError] = useState(null);
      const folderController = useRef(null);
      const decision = useRef(null), detailEpoch = useRef(0);
      const [decidingApproval, setDecidingApproval] = useState(null);
      const [decisionError, setDecisionError] = useState(null);
      const alive = useRef(0), pickingFolder = useRef(false);
      const last = useRef(seed ?? null), mutation = useRef(null), earlierAnchor = useRef(null);
      useEffect(() => {
        alive.current++;
        return () => { alive.current++; folderController.current?.abort(); };
      }, []);
      const callback = useRef(onRoom); callback.current = onRoom;
      function setRoomDraft(next) {
        if (!next.text && !next.recipient && !next.freeTalk && !next.identity) drafts.delete(id);
        else drafts.set(id, next);
        setDraftState(next);
      }
      function updateDraft(patch) {
        const current = drafts.get(id) ?? emptyDraft;
        const next = { ...current, ...patch };
        if (next.text.trim() !== current.text.trim() || next.recipient !== current.recipient || next.freeTalk !== current.freeTalk) next.identity = null;
        setRoomDraft(next);
      }
      function accept(next) {
        if (last.current && next.revision < last.current.revision) return;
        const changed = !last.current || next.revision !== last.current.revision || next.storageFailed !== last.current.storageFailed
          || next.workspaceAvailable !== last.current.workspaceAvailable || next.projectContextAvailable !== last.current.projectContextAvailable
          || next.capabilities?.projectOverview !== last.current.capabilities?.projectOverview || next.capabilities?.independentFolders !== last.current.capabilities?.independentFolders
          || next.capabilities?.freeTalk !== last.current.capabilities?.freeTalk || next.capabilities?.writerAssignment !== last.current.capabilities?.writerAssignment
          || hasProjectAccess(next) !== hasProjectAccess(last.current) || fileModeOf(next) !== fileModeOf(last.current)
          || next.pendingFileApproval?.id !== last.current.pendingFileApproval?.id || next.active !== last.current.active
          || next.turns.some((turn, i) => turn.fileAccessed !== last.current.turns[i]?.fileAccessed);
        if (changed) { detailEpoch.current++; last.current = next; setRoom(next); callback.current(next); }
        const pending = navigation.pendingSends.get(id);
        if (!pending?.size) return;
        const current = drafts.get(id) ?? emptyDraft;
        let clearMessage = false;
        for (const turn of next.turns) {
          if (!pending.has(turn.id)) continue;
          pending.delete(turn.id);
          if (current.identity?.id === turn.id) clearMessage = true;
        }
        if (!pending.size) navigation.pendingSends.delete(id);
        if (clearMessage) {
          setRoomDraft({ ...current, identity: null, text: '', recipient: '' });
          setActionError(null);
        }
      }
      useEffect(() => () => { mutation.current?.abort(); decision.current?.abort(); }, []);
      useEffect(() => {
        const ctl = new AbortController(); let timer;
        async function query() {
          const startedEpoch = detailEpoch.current;
          try {
            const result = await request('room', { roomId: id }, ctl.signal);
            if (ctl.signal.aborted) return;
            setReadError(null);
            // Do not resurrect an approval from a read started before a newer local observation.
            if (startedEpoch === detailEpoch.current || !last.current || result.revision > last.current.revision) accept(result);
          } catch (err) { if (!ctl.signal.aborted) setReadError(err); }
          if (!ctl.signal.aborted && last.current?.active) timer = window.setTimeout(query, 1100);
        }
        query();
        return () => { ctl.abort(); window.clearTimeout(timer); };
      }, [id, reload]);
      useEffect(() => {
        const refreshOnFocus = () => { if (!last.current?.active) setReload(n => n + 1); };
        window.addEventListener('focus', refreshOnFocus);
        return () => window.removeEventListener('focus', refreshOnFocus);
      }, []);
      useEffect(() => {
        if (typeof ResizeObserver !== 'function' || !scroll.current) return undefined;
        const node = scroll.current;
        const observer = new ResizeObserver(() => { if (following.current) openTop(node); });
        observer.observe(node);
        return () => observer.disconnect();
      }, []);
      useLayoutEffect(() => {
        const node = scroll.current;
        if (!node) return;
        if (earlierAnchor.current !== null) {
          node.scrollTop = node.scrollHeight - earlierAnchor.current;
          earlierAnchor.current = null;
        } else if (following.current) openTop(node);
      }, [room, older]);
      useEffect(() => {
        if (!stopFocus.current || room?.active || action) return;
        stopFocus.current = false;
        if (!matchMedia('(pointer: coarse)').matches && (document.activeElement === document.body || scroll.current?.contains(document.activeElement))) editor.current?.focus({ preventScroll: true });
      }, [room?.active, action]);
      function showEarlier() {
        earlierAnchor.current = scroll.current.scrollHeight - scroll.current.scrollTop;
        following.current = false; setOlder(true); setShowJump(true);
      }
      function jump() { following.current = true; setShowJump(false); openTop(scroll.current); }
      function dismissSettings() {
        setSettings(false);
        requestAnimationFrame(() => settings.current?.focus({ preventScroll: true }));
      }
      const folderLocked = current => Boolean(current?.turns.length && current?.members.length);
       async function chooseFolder() {
        const current = last.current;
        if (!current || folderLocked(current) || pickingFolder.current || mutation.current) return;
        const generation = alive.current;
        const ctl = new AbortController(); folderController.current = ctl;
        pickingFolder.current = true; setChoosingFolder(true); setActionError(null);
        try {
          const path = await navigation.pickFolder();
          if (path === null || ctl.signal.aborted || generation !== alive.current) return;
          const next = await request('bind-folder', { roomId: id, path, expectedRevision: current.revision }, ctl.signal);
          if (ctl.signal.aborted || generation !== alive.current) return;
          accept(next);
          // accept() invalidates any staged excerpts when the folder changes.
        } catch (err) {
          if (!ctl.signal.aborted && generation === alive.current) setActionError({ err, which: 'folder' });
        } finally {
          if (folderController.current === ctl) folderController.current = null;
          pickingFolder.current = false;
          if (!ctl.signal.aborted && generation === alive.current) setChoosingFolder(false);
        }
      }
      function canFreeTalk(current, state) {
        return current?.capabilities?.freeTalk === true && current.members.length >= 2 && !state.recipient;
      }
      function canSend(current, state) {
        return current && current.members.length > 0 && state.text.trim() && !current.active && current.workspaceAvailable && !current.storageFailed
          && (!state.recipient || current.memberKeys.includes(state.recipient));
      }
      async function run(which, event) {
        event?.preventDefault();
        const current = drafts.get(id) ?? emptyDraft;
        if (mutation.current || pickingFolder.current || !last.current || (which === 'send' && !canSend(last.current, current))) return;
        const ctl = new AbortController(); mutation.current = ctl; setAction(which); setActionError(null);
        if (which === 'send') jump(); else stopFocus.current = true;
        let args = { roomId: id }, pending;
        try {
          if (which === 'send') {
            const identity = { current: current.identity };
            args = withRequestId(identity, { roomId: id, text: current.text.trim(), ...(current.recipient ? { recipientKey: current.recipient } : {}),
              ...(current.freeTalk && canFreeTalk(last.current, current) ? { freeTalk: true } : {}), share: true }, true);
            setRoomDraft({ ...current, identity: identity.current });
            pending = navigation.pendingSends.get(id) ?? new Map();
            pending.set(args.requestId, true);
            navigation.pendingSends.set(id, pending);
          }
          const next = await request(which, args, ctl.signal);
          if (!ctl.signal.aborted) accept(next);
        } catch (err) {
          if (ctl.signal.aborted) return;
          if (pending && !pending.has(args.requestId)) return; // A concurrent room read already confirmed this send.
          if (pending && typeof err.code === 'string' && err.code !== 'unavailable') {
            pending.delete(args.requestId);
            if (!pending.size && navigation.pendingSends.get(id) === pending) navigation.pendingSends.delete(id);
          }
          setActionError({ err, which });
        } finally { mutation.current = null; if (!ctl.signal.aborted) { setAction(null); setReload(n => n + 1); } }
      }
      async function decideFileWrite(approvalId, approve) {
        const current = last.current;
        const pending = current?.pendingFileApproval;
        if (decision.current || mutation.current || !current?.active || !hasProjectAccess(current) || !pending || pending.id !== approvalId
          || (approve && !canApproveFileChange(pending))) return;
        const ctl = new AbortController(); decision.current = ctl;
        const startedEpoch = detailEpoch.current;
        setDecidingApproval(approvalId); setDecisionError(null);
        try {
          const next = await request('decide-file-write', { roomId: id, approvalId, approve }, ctl.signal);
          if (!ctl.signal.aborted && (startedEpoch === detailEpoch.current || next.revision > last.current.revision)) accept(next);
        } catch (err) {
          if (!ctl.signal.aborted) setDecisionError({ approvalId, err });
        } finally {
          decision.current = null;
          if (!ctl.signal.aborted) { setDecidingApproval(null); setReload(n => n + 1); }
        }
      }
      const lastTurn = room?.turns.at(-1);
      const visible = room ? older ? room.turns : room.turns.slice(-8) : [];
      const audience = room?.members.find(m => m.key === recipient);
      const missingAudience = Boolean(recipient && !audience);
      const projectAccess = hasProjectAccess(room);
      const effectiveMode = fileModeOf(room);
      const freeTalkSelected = Boolean(draftState.freeTalk && canFreeTalk(room, draftState));
      const freeTalkRunning = Boolean(room?.active && lastTurn?.freeTalk);
      const stopLabel = t(action === 'cancel' ? 'stopping' : freeTalkRunning ? 'stopFreeTalk' : 'cancel');
      const pendingApproval = projectAccess && room.active ? room.pendingFileApproval : null;
      const sendable = !choosingFolder && canSend(room, draftState);
      
      const title = room?.isDraft && room.title === 'New group chat' ? t('untitledGroup') : room?.title ?? seed?.title ?? t('untitledGroup');
      const folderTitle = room?.workspaceId === 'group-default' ? t('defaultFolder') : room?.folderTitle ?? workspaceTitle ?? t('defaultFolder');
      const sendLabel = audience ? `${t('sendOne')} · ${audience.label}` : t('send');
      const progress = lastTurn ? `${t(lastTurn.status)}${lastTurn.status === 'running' ? ` · ${t(lastTurn.phase)}` : ''}` : '';
      return h(Fragment, null,
        h(Header, { t, title, onBack },
          h('button', { type: 'button', className: 'mgc-icon-button', title: t('refresh'), 'aria-label': t('refresh'), onClick: () => setReload(n => n + 1) }, h(Glyph, { name: 'refresh' })),
          h('button', { type: 'button', className: 'mgc-quiet', ref: settings, title: t('settings'), 'aria-label': t('settings'), 'aria-haspopup': 'dialog',
            disabled: !room || choosingFolder, onClick: () => setSettings(true) }, h(Glyph, { name: 'settings' }), h('span', { className: 'mgc-settings-copy' }, t('settings')))),
        h(ConversationFrame, { t, scroll, scrollId, following, preferences: navigation.preferences },
          h('div', { id: scrollId, className: 'mgc-scroll', tabIndex: -1, ref: scroll, onScroll: e => {
          const node = e.currentTarget; const near = node.scrollHeight - node.clientHeight - node.scrollTop <= 85;
          following.current = near; setShowJump(!near);
        } },
          !room ? h('div', { className: 'mgc-empty', role: readError ? 'alert' : 'status' }, readError ? errText(t, readError) : t('loading'))
            : visible.length === 0 ? h('div', { className: 'mgc-empty mgc-hero' }, h(PanelIcon, { size: 28 }), h('h2', null, title),
              h('p', null, t(room.members.length ? 'notStarted' : 'modelSetupHint')), room.members.length > 0 && h('p', { className: 'mgc-muted' }, room.members.map(m => m.label).join(' · ')))
              : h('div', { className: 'mgc-column mgc-history', 'aria-label': room.title },
                !older && room.turns.length > 8 && h('button', { type: 'button', className: 'mgc-quiet', onClick: showEarlier }, t('older')),
                visible.map(turn => h(Turn, { key: turn.id, turn, members: room.members, t, renderFactorySlot })),
                room.active && h('p', { className: 'mgc-muted', role: 'status' }, t(freeTalkRunning ? 'freeTalkRunning' : 'workingTitle')))),
        room && h('div', { className: 'mgc-footer' },
          showJump && h('div', { className: 'mgc-jump' }, h('button', { type: 'button', className: 'mgc-quiet', onClick: jump }, h(Glyph, { name: 'down' }), t('jumpLatest'))),
          h('div', { className: 'mgc-column mgc-compose-notices' },
            readError && h(Notice, { role: 'alert' }, errText(t, readError), ' ', h('button', { type: 'button', className: 'mgc-quiet', onClick: () => setReload(n => n + 1) }, t('retry'))),
            !room.workspaceAvailable && h(Notice, null, t('missingWorkspace')),
            room.storageFailed && h(Notice, { role: 'alert' }, t('storageFailed')),
            missingAudience && h(Notice, { role: 'alert' }, t('formerAudience')),
            actionError && h(Notice, { role: 'alert' }, errText(t, actionError.err, actionError.which === 'send' ? 'unknownError' : actionError.which === 'folder' ? 'folderPickerUnavailable' : 'unknownStop'))),
          pendingApproval && h(FileApproval, { key: pendingApproval.id, t, approval: pendingApproval, deciding: decidingApproval !== null,
            stopping: Boolean(action), reviewSharing: !lastTurn?.recipientKey && (lastTurn?.members?.length ?? room.members.length) > 1,
            onDecide: decideFileWrite, onStop: () => run('cancel'),
            error: decisionError?.approvalId === pendingApproval.id ? decisionError.err : null }),
          h('div', { className: 'mgc-folder-row' },
            h('button', { type: 'button', className: 'mgc-quiet', disabled: choosingFolder || Boolean(action) || !room.capabilities?.independentFolders || folderLocked(room),
              title: folderLocked(room) ? t('folderLocked') : t('chooseFolder'), 'aria-label': `${t('chooseFolder')}: ${folderTitle}`,
              onClick: chooseFolder }, h(Glyph, { name: 'folder' }), h('span', { className: 'mgc-truncate' }, choosingFolder ? t('loading') : folderTitle), h(Glyph, { name: 'chevron', size: 12 })),
            projectAccess && h('button', { type: 'button', className: 'mgc-quiet mgc-file-badge', 'aria-haspopup': 'dialog',
              disabled: choosingFolder, onClick: () => setSettings(true) }, `${t('fileAccess')}: ${t(fileModes[effectiveMode])}`),
            projectAccess && !room.projectContextAvailable && h('span', { className: 'mgc-muted mgc-folder-context-status' }, t('projectFolderUnavailable'))),
          h('form', { className: 'mgc-composer', onSubmit: event => run('send', event) },
            h('textarea', { ref: editor, 'aria-label': t('placeholder'), placeholder: t('placeholder'), value: draft, rows: 2, maxLength: 8000,
              readOnly: action === 'send', disabled: !room.workspaceAvailable || room.storageFailed,
              onChange: event => updateDraft({ text: event.target.value }),
              onCompositionStart: () => { composing.current = true; }, onCompositionEnd: () => { composing.current = false; },
              onKeyDown: event => {
                if (event.key !== 'Enter' || event.shiftKey || event.altKey || (event.ctrlKey && event.metaKey) || composing.current || event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) return;
                if (sendable && !action) { event.preventDefault(); void run('send'); }
              } }),
            h('div', { className: 'mgc-compose-bar' },
              h('div', { className: 'mgc-compose-controls' },
                h(RecipientPicker, { t, members: room.members, value: recipient,
                  onChange: value => updateDraft({ recipient: value, ...(value ? { freeTalk: false } : {}) }), disabled: Boolean(action) || room.active }),
                canFreeTalk(room, draftState) && h('button', { type: 'button', className: 'mgc-quiet mgc-free-talk', 'aria-pressed': freeTalkSelected,
                  disabled: Boolean(action) || room.active, onClick: () => updateDraft({ freeTalk: !freeTalkSelected }) }, t('freeTalk'))),
              room.active ? h('button', { type: 'button', className: 'mgc-send mgc-send-active', title: stopLabel, 'aria-label': stopLabel, 'aria-busy': action === 'cancel', disabled: Boolean(action), onClick: () => run('cancel') }, h(Glyph, { name: 'stop', size: 17 }))
                : h('button', { type: 'submit', className: 'mgc-send', title: sendLabel, 'aria-label': sendLabel, disabled: !sendable || Boolean(action) }, h(Glyph, { name: 'arrow', size: 19 })))),
          freeTalkSelected && !room.active && h('p', { className: 'mgc-footnote' }, t('freeTalkHelp')),
          h('p', { className: 'mgc-footnote' }, t(recipient ? 'privateReply' : 'privacy'), projectAccess && room.projectContextAvailable && ` ${t(recipient ? 'filePrivacyDirect' : 'filePrivacy')}`))),
        showSettings && room && h(ChatSettings, { t, room, directory, onDismiss: dismissSettings,
          onSaved: next => { accept(next); dismissSettings(); }, onObserved: accept }));
      }
    function NewGroupButton({ t, wide, navigation, children }) {
      return h(Fragment, null, children, h('style', null, sidebarStyle),
        h('button', { type: 'button', className: 'mgc-new-group', 'data-wide': wide, title: t('create'),
          'aria-label': t('create'), onClick: () => navigation.startDraft() },
        h(PanelIcon, { size: 16 }), wide && h('span', null, t('create'))));
    }
    const sidebarStyle = `.mgc-new-group{height:38px;min-width:0;flex:0 1 45%;display:inline-flex;align-items:center;justify-content:center;gap:5px;padding:0 7px;border:.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-md,10px);background:var(--dsw-alias-button-elevated-fill);color:var(--dsw-alias-label-primary);font:inherit;font-weight:500;white-space:nowrap;cursor:pointer}.mgc-new-group:hover{background:var(--dsw-alias-button-floating-hover)}.mgc-new-group[data-wide='false']{width:36px;height:36px;flex:none;border-color:transparent;background:transparent;padding:0}.mgc-new-group>svg{flex:none}.mgc-new-group>span{overflow:hidden;text-overflow:ellipsis}.mgc-new-group:focus-visible{outline:1.5px solid var(--dsw-alias-state-business-primary);outline-offset:2px}:global([data-windows-titlebar] .collapsed) .mgc-new-group[data-wide='false']{position:fixed;top:calc((var(--dsh-windows-titlebar-height) - 28px)/2);left:84px;z-index:30;-webkit-app-region:no-drag}`;
    function Page({ t, navigation, renderFactorySlot }) {
      const nav = useSyncExternalStore(navigation.subscribe, navigation.getSnapshot);
      const treeId = useId();
      const treeToggle = useRef(null);
      const treePreferenceKey = 'dsh.modelGroupChat.treeCollapsed';
      const [treeCollapsed, setTreeCollapsed] = useState(() => {
        try { return window.localStorage.getItem(treePreferenceKey) === 'true'; }
        catch { return false; }
      });
      function updateTreeCollapsed(collapsed) {
        setTreeCollapsed(collapsed);
        try { window.localStorage.setItem(treePreferenceKey, String(collapsed)); }
        catch { /* the current view still updates without storage */ }
      }
      function returnToGroupList() {
        updateTreeCollapsed(false);
        navigation.change({ kind: 'list' });
        treeToggle.current?.focus({ preventScroll: true });
      }
      const [directory, setDirectory] = useState(null);
      const [error, setError] = useState(null);
      const [draftError, setDraftError] = useState(null);
      const [reload, setReload] = useState(0);
      const [draftRetry, setDraftRetry] = useState(0);
      const discarded = useRef(new Set());
      const [discarding, setDiscarding] = useState(false);
      const [deleteTarget, setDeleteTarget] = useState(null);
      const [deleteError, setDeleteError] = useState(null);
      const deletion = useRef(false);
      const deleteTitleId = useId();
      const deleteDescriptionId = useId();
      const deleteDialog = useRef(null);
      const deleteOrigin = useRef(null);
      const drafts = navigation.drafts;
      useLayoutEffect(() => {
        const dialog = deleteDialog.current;
        if (!deleteTarget || !dialog) return;
        if (!dialog.open) dialog.showModal();
        return () => {
          if (dialog.open) dialog.close();
          if (deleteOrigin.current?.isConnected) deleteOrigin.current.focus({ preventScroll: true });
          else treeToggle.current?.focus({ preventScroll: true });
        };
      }, [deleteTarget]);
      function openDelete(room, origin) { deleteOrigin.current = origin; setDeleteError(null); setDeleteTarget(room); }
      function closeDelete() { if (!deletion.current) { setDeleteTarget(null); setDeleteError(null); } }
      async function discard() {
        const room = deleteTarget;
        if (!room || deletion.current) return;
        const latest = directory?.rooms.find(item => item.id === room.id) ?? room;
        if (latest.active) { setDeleteError({ code: 'room-busy' }); return; }
        deletion.current = true;
        setDiscarding(true); setDeleteError(null);
        try {
          const modern = directory?.capabilities?.deleteRooms === true;
          await request(modern ? 'delete-room' : 'discard-draft', { roomId: latest.id, expectedRevision: latest.revision, ...(modern ? { confirm: true } : {}) });
          discarded.current.add(room.id);
          drafts.delete(room.id);
          navigation.pendingSends.delete(room.id);
          setDirectory(prev => prev && ({ ...prev, rooms: prev.rooms.filter(r => r.id !== room.id) }));
          setDeleteTarget(null);
          if (navigation.getSnapshot().roomId === room.id) returnToGroupList();
        } catch (err) { setDeleteError(err); if (err.code === 'stale-revision' || err.code === 'room-busy') setReload(n => n + 1); }
        finally { deletion.current = false; setDiscarding(false); }
      }
      useEffect(() => {
        const ctl = new AbortController();
        setError(null);
        request('directory', {}, ctl.signal).then(result => {
          if (ctl.signal.aborted) return;
          setDirectory(prev => {
            const newest = new Map(result.rooms.filter(room => !discarded.current.has(room.id)).map(room => [room.id, room]));
            for (const old of prev?.rooms ?? []) {
              if (!discarded.current.has(old.id) && newest.has(old.id) && old.revision > newest.get(old.id).revision) newest.set(old.id, old);
            }
            return { ...result, rooms: [...newest.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)) };
          });
        }).catch(err => { if (!ctl.signal.aborted) setError(err); });
        return () => ctl.abort();
      }, [nav.serial, reload]);
      function change(room) {
        if (discarded.current.has(room.id)) return;
        const { turns, pendingFileApproval, ...summary } = room;
        setDirectory(prev => {
          const workspaces = prev?.workspaces ?? [];
          const groups = workspaces.some(group => group.id === room.workspaceId) ? workspaces
            : [...workspaces, { id: room.workspaceId, title: room.folderTitle }];
          const existing = (prev?.rooms ?? []).find(r => r.id === room.id);
          if (existing && existing.revision > room.revision) return prev;
          return { ...prev, workspaces: groups, rooms: [summary, ...(prev?.rooms ?? []).filter(r => r.id !== room.id)]
            .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)) };
        });
      }
      useEffect(() => {
        if (nav.kind !== 'draft') return;
        const ctl = new AbortController();
        setDraftError(null);
        request('create-draft', { requestId: nav.requestId, ...(nav.workspaceId ? { workspaceId: nav.workspaceId } : {}) }, ctl.signal).then(room => {
          if (ctl.signal.aborted || navigation.getSnapshot().serial !== nav.serial) return;
          change(room);
          navigation.change({ kind: 'room', roomId: room.id, seed: room });
        }).catch(err => { if (!ctl.signal.aborted) setDraftError(err); });
        return () => ctl.abort();
      }, [nav.serial, draftRetry]);
      const rooms = directory?.rooms ?? [];
      const workspaces = directory?.workspaces ?? [];
      const selected = rooms.find(room => room.id === nav.roomId);
      const baseFolderName = folder => folder.id === 'group-default' ? t('defaultFolder') : folder.title || t('archivedWorkspace');
      const folderName = folder => {
        const base = baseFolderName(folder);
        const same = workspaces.filter(candidate => baseFolderName(candidate) === base).map(candidate => candidate.id).sort();
        return same.length > 1 ? `${base} · ${same.indexOf(folder.id) + 1}` : base;
      };
      const hasRoom = nav.kind === 'room' || nav.kind === 'draft';
      const [pendingText, setPendingText] = useState('');
      useEffect(() => { setPendingText(drafts.get(nav.requestId)?.text ?? ''); }, [nav.requestId]);
      const tree = h('nav', { id: treeId, className: 'mgc-group-tree', hidden: treeCollapsed, 'aria-label': t('roomList') },
        h('div', { className: 'mgc-tree-heading' }, h('h2', null, t('panel')),
          h('div', { className: 'mgc-actions' },
            h('button', { type: 'button', className: 'mgc-icon-button', title: t('refresh'), 'aria-label': t('refresh'), onClick: () => setReload(n => n + 1) }, h(Glyph, { name: 'refresh' })),
            h('button', { type: 'button', className: 'mgc-icon-button', title: t('create'), 'aria-label': t('create'), onClick: () => navigation.startDraft(false) }, h(Glyph, { name: 'plus' })))),
        error && h(Notice, { role: 'alert' }, errText(t, error)),
        !directory && !error && h('p', { className: 'mgc-muted', role: 'status' }, t('loading')),
        directory && directory.capabilities?.draftRooms !== true && h(Notice, null, t('settingsUnsupported')),
        workspaces.map(folder => {
          const name = folderName(folder);
          const groupRooms = rooms.filter(room => room.workspaceId === folder.id);
          return h('section', { key: folder.id, 'aria-label': name },
            h('div', { className: 'mgc-tree-folder', title: name },
              h(Glyph, { name: 'folder' }), h('span', { className: 'mgc-truncate' }, name),
              folder.creatable === true && h('button', { type: 'button', className: 'mgc-icon-button mgc-tree-add',
                title: `${t('newInFolder')}: ${name}`, 'aria-label': `${t('newInFolder')}: ${name}`,
                onClick: () => navigation.startDraft(true, folder.id) }, h(Glyph, { name: 'plus', size: 13 }))),
            groupRooms.map(room => {
              const label = room.isDraft ? `${room.title !== 'New group chat' ? room.title : t('untitledGroup')} · ${new Date(room.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : room.title;
              return h('div', { key: room.id, className: 'mgc-tree-room' },
                h('button', { type: 'button', className: 'mgc-room-row', title: label,
                  'aria-current': room.id === nav.roomId ? 'page' : undefined, onClick: () => navigation.change({ kind: 'room', roomId: room.id }) },
                  h('span', { className: 'mgc-truncate' }, label), room.active && h('span', { className: 'mgc-muted' }, t('online'))),
                (room.isDraft || directory?.capabilities?.deleteRooms === true) && h('button', { type: 'button', className: 'mgc-icon-button',
                  title: t(room.active ? 'deleteGroupBusy' : room.isDraft ? 'discardGroup' : 'deleteGroup'), 'aria-label': t(room.isDraft ? 'discardGroup' : 'deleteGroup'),
                  disabled: discarding, onClick: event => openDelete(room, event.currentTarget) }, h(Glyph, { name: 'close', size: 14 })));
            }));
        }));
      const main = nav.kind === 'room'
        ? h(RoomView, { key: nav.roomId, t, navigation, id: nav.roomId, seed: nav.seed,
          onRoom: change, workspaceTitle: selected?.folderTitle, onBack: returnToGroupList, drafts, directory, renderFactorySlot })
        : h(Fragment, null,
          h(Header, { t, title: nav.kind === 'draft' ? t('untitledGroup') : t('panel'), onBack: nav.kind === 'draft' ? returnToGroupList : undefined }),
          h('div', { className: 'mgc-scroll' }, h('div', { className: 'mgc-empty mgc-hero' }, h(PanelIcon, { size: 28 }),
            h('h2', null, t(nav.kind === 'draft' ? 'untitledGroup' : 'panel')),
            nav.kind === 'draft' ? (draftError
              ? h(Notice, { role: 'alert' }, draftError.code === 'invalid-request' ? t('settingsUnsupported') : errText(t, draftError, 'unknownCreate'),
                h('button', { type: 'button', className: 'mgc-quiet', onClick: () => setDraftRetry(n => n + 1) }, t('retry')))
              : h('p', { role: 'status' }, t('creating')))
              : h(Fragment, null, h('p', null, t('opening')), h('button', { type: 'button', className: 'mgc-primary', onClick: () => navigation.startDraft(false) }, t('create'))))),
          nav.kind === 'draft' && h('div', { className: 'mgc-footer' },
            h('div', { className: 'mgc-folder-row' }, h(Glyph, { name: 'folder' }),
              (() => { const folder = workspaces.find(item => item.id === nav.workspaceId); return folder ? folderName(folder) : t('defaultFolder'); })()),
            h('div', { className: 'mgc-composer' }, h('textarea', { value: pendingText, rows: 2, maxLength: 8000,
              placeholder: t('placeholder'), 'aria-label': t('placeholder'), onChange: event => {
                const text = event.target.value;
                drafts.set(nav.requestId, { ...(drafts.get(nav.requestId) ?? emptyDraft), text });
                setPendingText(text);
              } }),
              h('div', { className: 'mgc-compose-bar' }, h('span', { className: 'mgc-muted' }, t('modelSetupHint')),
                h('button', { type: 'button', disabled: true, className: 'mgc-send', 'aria-label': t('send') }, h(Glyph, { name: 'arrow', size: 19 }))))));
      const treeToggleLabel = t(treeCollapsed ? 'showGroupTree' : 'hideGroupTree');
      return h('div', { className: 'mgc-page' }, h('style', null, css),
        h('div', { className: 'mgc-tree-toolbar' },
          h('button', { type: 'button', className: 'mgc-quiet mgc-tree-toggle', ref: treeToggle,
            'aria-expanded': !treeCollapsed, 'aria-controls': treeId, onClick: () => updateTreeCollapsed(!treeCollapsed) },
          h(Glyph, { name: 'sidebar' }), h('span', null, treeToggleLabel))),
        h('div', { className: 'mgc-group-panel', 'data-room': hasRoom, 'data-tree-collapsed': treeCollapsed },
          tree, h('div', { className: 'mgc-group-main' }, main)),
        deleteTarget && h('dialog', { ref: deleteDialog, className: 'mgc-dialog', 'aria-labelledby': deleteTitleId, 'aria-describedby': deleteDescriptionId,
          onCancel: event => { event.preventDefault(); closeDelete(); } },
          h('div', { className: 'mgc-dialog-head' }, h('h2', { id: deleteTitleId }, t('deleteGroup'))),
          h('div', { className: 'mgc-editor' },
            h('p', { id: deleteDescriptionId }, t('deleteGroupConfirm', { title: deleteTarget.title })),
            (deleteError || (directory?.rooms.find(item => item.id === deleteTarget.id) ?? deleteTarget).active) && h(Notice, { role: 'alert' },
              deleteError?.code === 'room-busy' || !deleteError
                ? t('deleteGroupBusy') : errText(t, deleteError, 'deleteGroupFailed'))),
          h('div', { className: 'mgc-dialog-foot' },
            h('button', { type: 'button', className: 'mgc-quiet', autoFocus: true, onClick: closeDelete, disabled: discarding }, t('cancelDelete')),
            h('button', { type: 'button', className: 'mgc-primary', onClick: discard,
              disabled: discarding || (directory?.rooms.find(item => item.id === deleteTarget.id) ?? deleteTarget).active }, t(discarding ? 'deleteGroupWorking' : 'deleteGroup')))));
    }
    function navigationStore(layout, pickFolder, nextId = () => crypto.randomUUID()) {
      let storage;
      try { storage = window.localStorage; } catch { /* optional browser preference */ }
      const preferences = widthPreference(storage);
      let state = { kind: 'list', serial: 0 };
      const listeners = new Set();
      function change(next) {
        state = { ...next, serial: state.serial + 1 };
        for (const listener of listeners) listener();
      }
      return {
        drafts: new Map(), pendingSends: new Map(), preferences, change, getSnapshot: () => state,
        subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
        startDraft(openPanel = true, workspaceId = undefined) {
          if (openPanel) layout.selectPanel(ID);
          // Reuse an open draft in the same folder; otherwise start a new one.
          if (state.kind !== 'draft' || state.workspaceId !== workspaceId) change({ kind: 'draft', requestId: nextId(), workspaceId });
        },
        async pickFolder() { return pickFolder(); },
      };
    }
    async function pickGroupFolder(desktop, workspaceUi) {
      const result = typeof desktop?.pick === 'function' ? await desktop.pick()
        : typeof workspaceUi?.pickDirectory === 'function' ? await workspaceUi.pickDirectory() : null;
      if (result === null && (typeof desktop?.pick === 'function' || typeof workspaceUi?.pickDirectory === 'function')) return null;
      if (typeof result !== 'string' || !result || result.length > 1024) throw Object.assign(new Error('Native folder picker unavailable'), { code: 'folder-unavailable' });
      return result;
    }
    return {
      inject: ['slots', 'locale', 'layout', 'uiWorkspace'],
      apply(ctx) {
        const navigation = navigationStore(ctx.layout, () => pickGroupFolder(globalThis.__DSH_DIRECTORY_PICKER__, ctx.uiWorkspace));
        ctx.effect(() => ctx.locale.register(NS, { en, zh }), 'model group chat dictionaries');
        const t = ctx.locale.bind(NS);
        ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: ID, locale: NS, inject: () => ({ navigation }) }, Page));
        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({ name: 'sidebar.panellist', id: ID, order: 20, locale: NS, label: () => t('panel') }, PanelIcon));
        ctx.slots.inject('sidebar.session.action', () => ctx.slots.register({ name: 'sidebar.session.action', id: ID, order: 20, locale: NS, inject: () => ({ navigation }) }, NewGroupButton));
      },
    };
  },
});
