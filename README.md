# 模型群聊 / Model group chat

适用于 DeepSeek Harness **0.2.2-rc.5**。

1. 在展开的 DSH 左栏，点击「新会话」旁的**「新群聊」**，先打开空白聊天，不要求先配置模型。也可从左栏「模型群聊」打开独立的群聊树。群聊按文件夹分组，不往普通工作区列表里添加群聊或文件夹。空白草稿可从群聊树删除。
2. 点击输入框左上方的文件夹行，用 DSH 原生系统选择器绑定本机文件夹。保持「默认工作区」即使用 DSH 默认路径，模型会收到该目录名称；只有需要时才调用文件工具读取内容。已有聊天保留自己的文件夹；发送第一条消息后不能再切换。
3. 点右上角「群聊设置」，从 DSH「设置 → 模型」已配置的模型中选择 1–4 个，为每位成员选产品经理、设计师、开发者、测试工程师、架构师等预设或自定义角色，再编辑提示词。可选择是否由某位模型总结。设置从下次发送起生效，旧记录不改写。
4. 普通群发由成员独立回答，并可选总结；也可用 @ 定向发送。至少两位模型时，可在输入框选「全体成员」并开启「畅所欲言」，让模型互相提问和回答。运行时发送键变为停止键，点它即可停止。每轮最多追加 24 条发言，达到上限或可用成员不足也会结束；模型调用可能产生费用。你的消息在右，模型气泡在左，输入框位于底部。宽屏可拖动两侧手柄调整聊天宽度。

新回答优先给结论，不重复前文。默认显示上限：独立回答与定向回复 800 字符，畅所欲言的追加发言 320 字符，修改评议 700 字符，总结 1150 字符。超长优先在句末截断并标记「…」。行首装饰性的星号和圆点整理为数字列表，粗体等排版标记不保留；代码、通配符和公式中的实际字符不作为装饰清理。旧聊天不改写。


## 附件与图片

输入框左侧的回形针可以添加文件或图片（每条消息最多 3 个，单个不超过 8 MB）：

- 文档（xlsx/docx/pptx/pdf/csv/txt/md/json/xml/html）在发送前解析成文本，随本轮消息一起发给所有成员，不需要模型再调用文件工具。
- 图片交给 DSH 的附件服务存档，只有声明支持图片输入的模型会收到图片；其它成员收到的是一条图片说明，不会让整轮请求失败。
- 项目目录里的同类文件也可以直接用 `project_read` 读取，按页返回解析后的文本。

历史群聊：在「模型群聊」列表中点击群名右侧的 ×，再确认删除。删除不可撤销，只移除这个群聊及其本地聊天记录，不会删除工作区或项目文件。若正在回复，先停止再删除。

## 项目文件

新消息不会自动附带项目文件。需要项目资料时，模型可以在选定的文件夹中逐层列出目录，并分批读取相关 UTF-8 文本。每批输出和每轮调用次数仍有上限；超过 512 项的单个目录、超过 1 MiB 的单个文件不在此功能的读取范围内。读取的内容会发给发起读取的模型提供商，模型的回答也可能引用它。已知敏感路径和疑似密钥会被拦截，不能保证识别所有敏感信息。旧聊天已有的项目摘录仍保留。

在「群聊设置 → 项目文件权限」选择模式并应用：

- **仅可查看（默认）**：可列出和读取已选文件夹内符合条件的文件，不可写入。
- **工作区内修改**：可以提议在已选文件夹内编辑已有文本或新建文本文件，每次都要在聊天中批准准确的路径和修改内容。
- **完全权限**：还可以访问你在本条消息中用双引号或反引号明确写出的项目外绝对路径。仍受系统权限和文件筛选限制，且写入仍需逐次批准。

群内所有参与模型按当前模式读取。可在「群聊设置 → 写入成员」指定一位可提议写入的模型；未指定时，仅定向发送给某位成员或单成员群可提议写入。仍须先切换到允许写入的模式，并逐次批准。群发时，写入成功后，其他成员会收到已应用的改动内容并以只读权限评议。直接回复不邀请其他模型评议。停止会结束讨论，不会回滚已写入的修改。三种模式使用 DSH 的原生文件服务和逐次沙箱策略，不改变普通会话权限；群聊不提供终端、执行命令、删除文件，也不提供通用 DSH Agent 工具。目录和文本读取有大小限制。保存权限不会读取文件或调用模型；重启也不会重发中断的讨论或重新执行待批准操作。文件工具会增加模型调用次数，各厂商按现有配置计费。

Use New group chat beside New Session and bind a local folder above the composer. Group Settings controls the roster and file access. The default read-only mode lists and reads eligible project text on demand after a user send. Workspace write adds per-change approved edits and creates; Full access also permits explicitly quoted outside absolute paths from the current user message. No shell or file deletion is available. All participating models read according to the selected mode. Assign a writing member for group sends; if unassigned, only the direct recipient or the sole member can propose writes. Other participants review applied changes in group sends without write access. For two or more models, enable Free discussion in the composer to let them ask and answer each other. Click the send button in its Stop state to end it; the mode admits at most 24 follow-up messages per send.

For developers: run `npm test` in the source directory. Tests use deterministic mock model routes, not paid requests or workspace data.
