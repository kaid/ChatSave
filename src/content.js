(function () {
  const BUTTON_ID = "chatgpt-session-export-md-button";
  const BUTTON_WRAPPER_ID = "chatgpt-session-export-md-wrapper";
  const TOOLTIP_ID = "chatgpt-session-export-md-tooltip";
  const EXPORT_RIGHT_WIDE = 170;
  const EXPORT_RIGHT_COMPACT_WIDE = 132;
  const I18N = {
    en: {
      buttonText: "Export chat",
      loadingText: "Exporting...",
      errorText: "Export failed",
      userRole: "You",
      assistantRole: "ChatGPT",
      emptyBody: "(No text)",
      attachments: "Attachments:",
      unnamedAttachment: "Unnamed attachment",
      sourceDetail: "source {value}",
      defaultTitle: "ChatGPT conversation export",
      exportedAt: "Exported at",
      link: "Link",
      source: "Source",
      streamSource: "Conversation API (streaming)",
      apiSource: "Conversation API",
      emptyConversation:
        "No conversation content was detected. Make sure the current page is a conversation page.",
      markdownFileDescription: "Markdown File",
      exportFailedLog: "[ChatGPT Export] Export failed",
      exportFailedAlert:
        "Export failed. Make sure you are logged in and the conversation page is open, then try again.",
    },
    fr: {
      buttonText: "Exporter",
      loadingText: "Export...",
      errorText: "Échec export",
      userRole: "Vous",
      assistantRole: "ChatGPT",
      emptyBody: "(Aucun texte)",
      attachments: "Pièces jointes :",
      unnamedAttachment: "Pièce jointe sans nom",
      sourceDetail: "source {value}",
      defaultTitle: "Export de conversation ChatGPT",
      exportedAt: "Exporté le",
      link: "Lien",
      source: "Source",
      streamSource: "API de conversation (streaming)",
      apiSource: "API de conversation",
      emptyConversation:
        "Aucun contenu de conversation détecté. Vérifiez que la page actuelle est une page de conversation.",
      markdownFileDescription: "Fichier Markdown",
      exportFailedLog: "[ChatGPT Export] Échec de l’export",
      exportFailedAlert:
        "Échec de l’export. Vérifiez que vous êtes connecté et que la page de conversation est ouverte, puis réessayez.",
    },
    es: {
      buttonText: "Exportar",
      loadingText: "Exportando...",
      errorText: "Error export",
      userRole: "Tú",
      assistantRole: "ChatGPT",
      emptyBody: "(Sin texto)",
      attachments: "Adjuntos:",
      unnamedAttachment: "Adjunto sin nombre",
      sourceDetail: "origen {value}",
      defaultTitle: "Exportación de conversación de ChatGPT",
      exportedAt: "Exportado el",
      link: "Enlace",
      source: "Origen",
      streamSource: "API de conversación (streaming)",
      apiSource: "API de conversación",
      emptyConversation:
        "No se detectó contenido de conversación. Confirma que la página actual sea una conversación.",
      markdownFileDescription: "Archivo Markdown",
      exportFailedLog: "[ChatGPT Export] Error al exportar",
      exportFailedAlert:
        "Error al exportar. Confirma que hayas iniciado sesión y que la conversación esté abierta; luego inténtalo de nuevo.",
    },
    pt: {
      buttonText: "Exportar",
      loadingText: "Exportando...",
      errorText: "Falha export",
      userRole: "Você",
      assistantRole: "ChatGPT",
      emptyBody: "(Sem texto)",
      attachments: "Anexos:",
      unnamedAttachment: "Anexo sem nome",
      sourceDetail: "origem {value}",
      defaultTitle: "Exportação de conversa do ChatGPT",
      exportedAt: "Exportado em",
      link: "Link",
      source: "Origem",
      streamSource: "API de conversa (streaming)",
      apiSource: "API de conversa",
      emptyConversation:
        "Nenhum conteúdo de conversa foi detectado. Confirme que a página atual é uma conversa.",
      markdownFileDescription: "Arquivo Markdown",
      exportFailedLog: "[ChatGPT Export] Falha ao exportar",
      exportFailedAlert:
        "Falha ao exportar. Confirme que você está conectado e que a conversa está aberta; depois tente novamente.",
    },
    "zh-Hans": {
      buttonText: "导出会话",
      loadingText: "导出中...",
      errorText: "导出失败",
      userRole: "你",
      assistantRole: "ChatGPT",
      emptyBody: "（无正文）",
      attachments: "附件：",
      unnamedAttachment: "未命名附件",
      sourceDetail: "来源 {value}",
      defaultTitle: "ChatGPT 会话导出",
      exportedAt: "导出时间",
      link: "链接",
      source: "来源",
      streamSource: "会话接口（流式）",
      apiSource: "会话接口",
      emptyConversation: "未检测到会话内容。请确认当前是会话详情页。",
      markdownFileDescription: "Markdown 文件",
      exportFailedLog: "[ChatGPT Export] 导出失败",
      exportFailedAlert: "导出失败，请先确认已登录并在会话页打开后再试。",
    },
    "zh-Hant": {
      buttonText: "匯出對話",
      loadingText: "匯出中...",
      errorText: "匯出失敗",
      userRole: "你",
      assistantRole: "ChatGPT",
      emptyBody: "（無正文）",
      attachments: "附件：",
      unnamedAttachment: "未命名附件",
      sourceDetail: "來源 {value}",
      defaultTitle: "ChatGPT 對話匯出",
      exportedAt: "匯出時間",
      link: "連結",
      source: "來源",
      streamSource: "對話 API（串流）",
      apiSource: "對話 API",
      emptyConversation: "未偵測到對話內容。請確認目前頁面是對話頁。",
      markdownFileDescription: "Markdown 檔案",
      exportFailedLog: "[ChatGPT Export] 匯出失敗",
      exportFailedAlert: "匯出失敗，請先確認已登入並開啟對話頁後再試。",
    },
  };
  const HANT_REGIONS = new Set(["tw", "hk", "mo"]);
  function detectLocale() {
    const languages = navigator.languages?.length
      ? navigator.languages
      : [navigator.language || "en"];
    for (const raw of languages) {
      const lang = String(raw || "").toLowerCase();
      if (!lang) continue;
      if (lang.startsWith("zh")) {
        if (lang.includes("hant") || HANT_REGIONS.has(lang.split("-")[1])) {
          return "zh-Hant";
        }
        return "zh-Hans";
      }
      const base = lang.split("-")[0];
      if (base === "fr" || base === "es" || base === "pt") return base;
      if (base === "en") return "en";
    }
    return "en";
  }
  const LOCALE = detectLocale();
  const MESSAGES = I18N[LOCALE] || I18N.en;
  function t(key, params = {}) {
    const template = MESSAGES[key] || I18N.en[key] || key;
    return Object.entries(params).reduce(
      (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
      template,
    );
  }
  const HIDDEN_CONTENT_TYPES = new Set([
    "thoughts",
    "reasoning_recap",
    "model_editable_context",
    "user_editable_context",
    "computer_output",
  ]);
  const CONVERSATION_API_ENDPOINT = "/backend-api/conversation/";
  function getTargetRoute(path) {
    if (!path) return "/backend-api/conversation/{conversation_id}";
    return "/backend-api/conversation/{conversation_id}";
  }

  function getCookieValue(name) {
    const cookie = `; ${document.cookie}`;
    const needle = `; ${name}=`;
    const index = cookie.indexOf(needle);
    if (index === -1) return null;
    const start = index + needle.length;
    const end = cookie.indexOf(";", start);
    return decodeURIComponent(
      (end === -1 ? cookie.slice(start) : cookie.slice(start, end)).trim(),
    );
  }

  function parseJsonText(value) {
    if (!value || typeof value !== "string") return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    try {
      return JSON.parse(trimmed);
    } catch (_error) {
      const start = trimmed.indexOf("{");
      const end = trimmed.lastIndexOf("}");
      if (start !== -1 && end > start) {
        try {
          return JSON.parse(trimmed.slice(start, end + 1));
        } catch (_extractError) {
          return null;
        }
      }
      return null;
    }
  }

  function findSessionTokenFromObject(value) {
    const jwtLike = /^eyJ[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+$/;
    if (!value || typeof value !== "object") return null;
    const stack = [value];
    const visited = new Set();

    while (stack.length) {
      const current = stack.pop();
      if (!current || typeof current !== "object" || visited.has(current)) {
        continue;
      }
      visited.add(current);

      if (Array.isArray(current)) {
        for (const item of current) {
          if (typeof item === "string" && jwtLike.test(item)) return item;
          if (typeof item === "object" && item !== null) stack.push(item);
        }
        continue;
      }

      for (const [k, item] of Object.entries(current)) {
        if (typeof item === "string") {
          if (
            jwtLike.test(item) &&
            (/token/i.test(k) || /access/i.test(k))
          ) {
            return item;
          }
        } else if (item && typeof item === "object") {
          stack.push(item);
        }
      }
    }
    return null;
  }

  function getAuthFromClientBootstrap() {
    const candidateElements = [
      document.getElementById("client-bootstrap"),
      document.getElementById("__NEXT_DATA__"),
      document.getElementById("__next_data__"),
      document.getElementById("bootstrap"),
    ];
    const globalCandidates = [
      window.__NEXT_DATA__,
      window.__NEXT_DATA__?.props,
      window.__NEXT_DATA__?.props?.pageProps,
      window.__NEXT_DATA__?.__NEXT_DATA__,
      window?.__NEXT_PROPS__,
      window?.__NEXT_DATA_PROPS__,
      window?.chatgptBootstrapData,
      window?.clientBootstrapData,
    ];

    const candidateScripts = candidateElements.filter(Boolean).map((node) =>
      node?.textContent
    );

    const parsed = candidateScripts
      .map(parseJsonText)
      .filter((payload) => payload && typeof payload === "object");
    const allPayloads = [...globalCandidates, ...parsed];

    for (const payload of allPayloads) {
      const bootstrapToken = payload?.session?.accessToken ||
        payload?.session?.access_token ||
        payload?.auth?.accessToken ||
        payload?.auth?.access_token ||
        payload?.chatgpt?.session?.accessToken ||
        payload?.chatgpt?.session?.access_token;
      if (bootstrapToken && bootstrapToken.startsWith("eyJ")) {
        return bootstrapToken;
      }

      const found = findSessionTokenFromObject(payload);
      if (found) return found;
    }

    const inline = parseJsonText(
      document?.documentElement?.dataset?.bootstrap || "",
    );
    if (inline) {
      const bootstrapToken = inline?.session?.accessToken ||
        inline?.session?.access_token ||
        inline?.auth?.accessToken ||
        inline?.auth?.access_token;
      if (bootstrapToken && bootstrapToken.startsWith("eyJ")) {
        return bootstrapToken;
      }
      return findSessionTokenFromObject(inline);
    }

    return null;
  }

  function readPossibleAuthTokens() {
    const sources = [
      window.localStorage,
      window.sessionStorage,
      document.documentElement?.dataset || {},
    ];
    const jwtLike = /^eyJ[a-zA-Z0-9-_]+?\.[a-zA-Z0-9-_]+?\.[a-zA-Z0-9-_]+$/;
    const candidates = [];

    for (const source of sources) {
      if (!source || typeof source !== "object") continue;
      for (const rawKey of Object.keys(source)) {
        const key = String(rawKey);
        if (!source[key] || typeof source[key] !== "string") continue;
        if (!jwtLike.test(source[key])) continue;
        candidates.push({ key, value: source[key], priority: 0 });
      }
    }

    return candidates;
  }

  function getAuthToken() {
    const bootstrapToken = getAuthFromClientBootstrap();
    if (bootstrapToken) return bootstrapToken;

    const direct = [
      "oai-datadog-token",
      "oai-auth-token",
      "openai-token",
      "access-token",
      "authorization",
    ];

    for (const key of direct) {
      const value = window.localStorage.getItem(key) ||
        window.sessionStorage.getItem(key);
      if (value && value.startsWith("eyJ")) return value;
      const prefixed = window.localStorage.getItem(`__${key}`) ||
        window.sessionStorage.getItem(`__${key}`);
      if (prefixed && prefixed.startsWith("eyJ")) return prefixed;
    }

    const all = readPossibleAuthTokens();
    const byLength = [...all].sort((a, b) => b.value.length - a.value.length);
    return byLength.length ? byLength[0].value : null;
  }

  function buildApiHeaders(routePath) {
    const targetPath = routePath || "";
    const headers = {
      accept: "*/*",
      "accept-language": navigator.language || "en-US",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "x-openai-target-path": targetPath,
      "x-openai-target-route": getTargetRoute(targetPath),
    };

    const buildNumber = getCookieValue("oai-client-build-number");
    if (buildNumber) {
      headers["oai-client-build-number"] = buildNumber;
    }

    const clientVersion = getCookieValue("oai-client-version");
    if (clientVersion) headers["oai-client-version"] = clientVersion;

    const deviceId = getCookieValue("oai-did") ||
      getCookieValue("__Host-oai-did");
    if (deviceId) headers["oai-device-id"] = deviceId;

    const sessionId = getCookieValue("oai-session-id");
    if (sessionId) headers["oai-session-id"] = sessionId;

    const authToken = getAuthToken();
    if (authToken) {
      headers.authorization = `Bearer ${authToken}`;
    }

    return headers;
  }

  function toText(value) {
    if (!value) return "";
    if (typeof value === "string") {
      return value
        .replace(/\u00a0/g, " ")
        .replace(/\r\n?/g, "\n")
        .trim()
        .replace(/\n{3,}/g, "\n\n");
    }

    if (Array.isArray(value)) {
      return value
        .map((part) => toText(part))
        .filter(Boolean)
        .join("\n\n")
        .replace(/\n{3,}/g, "\n\n");
    }

    if (typeof value === "object") {
      if (typeof value.text === "string") return toText(value.text);
      if (typeof value.value === "string") return toText(value.value);
      if (typeof value.content === "string") return toText(value.content);
      if (typeof value.summary === "string") return toText(value.summary);
    }

    return "";
  }

  function asArray(value) {
    if (!Array.isArray(value)) return [];
    return value;
  }

  function normalizeAttachment(raw) {
    if (!raw || typeof raw !== "object") return null;

    const id = raw?.id || raw?.file_id || raw?.fileId;
    const name = raw?.name || raw?.filename || raw?.file_name;
    const mimeType = raw?.mime_type || raw?.mimeType || raw?.type;
    const libraryFileId = raw?.library_file_id || raw?.libraryFileId ||
      raw?.lib_file_id;
    const source = raw?.source || raw?.source_type || raw?.provider;

    if (!id && !name && !libraryFileId) return null;

    return {
      id,
      name,
      mimeType,
      libraryFileId,
      source,
      isBigPaste: !!raw?.is_big_paste,
    };
  }

  function collectAttachments(message) {
    if (!message || typeof message !== "object") return [];

    const attachments = [
      ...asArray(message.attachments),
      ...asArray(message?.metadata?.attachments),
      ...asArray(message?.content?.attachments),
    ];

    const normalized = [];
    const seen = new Set();

    for (const raw of attachments) {
      const attachment = normalizeAttachment(raw);
      if (!attachment) continue;
      const key = attachment.id ||
        `${attachment.name || ""}|${attachment.libraryFileId || ""}`;
      if (seen.has(key)) continue;
      seen.add(key);
      normalized.push(attachment);
    }

    return normalized;
  }

  function normalizeRole(role) {
    if (role === "user") return t("userRole");
    if (role === "assistant") return t("assistantRole");
    return role || "unknown";
  }

  function getConversationIdFromUrl() {
    const pathname = location.pathname;
    const candidates = [
      /\/backend-api\/conversation\/([a-zA-Z0-9\-_]+)/,
      /\/share\/([a-zA-Z0-9\-_]+)/,
      /\/c\/([a-zA-Z0-9\-_]+)/,
    ];
    for (const pattern of candidates) {
      const match = pathname.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  }

  function readMessageText(message) {
    const content = message?.content || message?.message?.content || {};
    if (Array.isArray(content?.parts)) return toText(content.parts);
    if (content?.parts && !Array.isArray(content.parts)) {
      return toText(content.parts);
    }
    if (typeof content?.content === "string") return toText(content.content);
    if (typeof content?.text === "string") return toText(content.text);
    if (typeof message?.text === "string") return toText(message.text);
    return "";
  }

  function normalizeMessage(message, createdIndex = 0) {
    const msg = message?.message || message;
    if (!msg || typeof msg !== "object") return null;

    const role = msg?.author?.role || msg?.role || msg?.sender;
    if (role !== "user" && role !== "assistant") return null;
    const metadata = msg?.metadata || {};
    if (metadata?.is_visually_hidden_from_conversation === true) {
      return null;
    }

    const contentType = msg?.content?.content_type;
    if (contentType && HIDDEN_CONTENT_TYPES.has(contentType)) return null;

    const text = toText(readMessageText(msg));
    const attachments = collectAttachments(msg);
    if (!text && attachments.length === 0) return null;

    return {
      role: normalizeRole(role),
      text: text || t("emptyBody"),
      attachments,
      id: msg?.id || message?.id || `${role}-${createdIndex}`,
      createdAt: Number(
        msg?.create_time || msg?.update_time || message?.createdAt ||
          createdIndex,
      ),
    };
  }

  function formatAttachmentLines(attachments) {
    const lines = [t("attachments")];
    const separator = LOCALE.startsWith("zh") ? "；" : "; ";
    for (const attachment of attachments) {
      const name = attachment.name || t("unnamedAttachment");
      const detail = [
        attachment.mimeType,
        attachment.source && t("sourceDetail", { value: attachment.source }),
        attachment.libraryFileId &&
        `library_file_id ${attachment.libraryFileId}`,
        attachment.id && `id ${attachment.id}`,
      ].filter(Boolean).join(separator);
      lines.push(detail ? `- ${name}（${detail}）` : `- ${name}`);
    }
    return lines;
  }

  function formatMessageMarkdownBlock(message) {
    const lines = [];
    lines.push(`## ${message.role}`);
    lines.push("");
    lines.push(message.text);

    if (message.attachments && message.attachments.length > 0) {
      lines.push("");
      lines.push(...formatAttachmentLines(message.attachments));
    }

    lines.push("");
    return `${lines.join("\n")}\n`;
  }

  function unescapeJsonString(value) {
    if (value == null) return "";
    try {
      return JSON.parse(`"${value}"`);
    } catch (_error) {
      return value
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\")
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "\r")
        .replace(/\\t/g, "\t");
    }
  }

  function makeMarkdownHeader({
    title,
    url,
    source,
    extra = "",
  }) {
    const lines = [];
    lines.push(`# ${title || t("defaultTitle")}`);
    lines.push("");
    lines.push(`- ${t("exportedAt")}：${new Date().toLocaleString()}`);
    lines.push(`- ${t("link")}：${url}`);
    lines.push(`- ${t("source")}：${source}`);
    if (extra) lines.push(`- ${extra}`);
    lines.push("");
    lines.push("---");
    lines.push("");
    return `${lines.join("\n")}\n`;
  }

  function canUseStreamingDownload() {
    return !!(typeof window !== "undefined" && window.showSaveFilePicker &&
      typeof TextEncoderStream === "function");
  }

  async function createStreamingMarkdownWriter(filename) {
    if (canUseStreamingDownload()) {
      try {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [
            {
              description: t("markdownFileDescription"),
              accept: { "text/markdown": [".md"] },
            },
          ],
        });
        const fileWritable = await fileHandle.createWritable();
        const encoderStream = new TextEncoderStream();
        const piping = encoderStream.readable.pipeTo(fileWritable);
        const writer = encoderStream.writable.getWriter();

        return {
          mode: "stream",
          write: (text) => writer.write(text),
          close: async () => {
            await writer.close();
            await piping;
          },
          abort: async () => {
            await writer.abort();
            await fileWritable.close();
          },
        };
      } catch (_error) {
        // Permission denied or unsupported environment, fallback to memory mode.
      }
    }

    const chunks = [];
    return {
      mode: "memory",
      write: (text) => {
        if (text) chunks.push(text);
      },
      close: async () => {
        const blob = new Blob(chunks, { type: "text/markdown;charset=utf-8" });
        const href = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = href;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(href);
      },
      abort: () => {},
    };
  }

  async function parseConversationFromStream(responseBody, onMessage) {
    const reader = responseBody.getReader();
    const decoder = new TextDecoder();
    let title = null;
    let titleProbe = "";
    let mappingState = 0;
    let mappingBody = false;
    let mappingStarted = false;
    let inString = false;
    let escaped = false;
    let stringBuffer = "";
    let capture = "";
    let captureDepth = 0;
    let isCapturing = false;
    const seenIds = new Set();
    let emittedCount = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const scan = decoder.decode(value, { stream: true });

      if (!title) {
        titleProbe = `${titleProbe}${scan}`.slice(-4000);
        const titleMatch = titleProbe.match(
          /"title"\s*:\s*"((?:\\.|[^"\\])*)"/,
        );
        if (titleMatch) {
          title = unescapeJsonString(titleMatch[1]);
        }
      }

      for (let i = 0; i < scan.length; i += 1) {
        const ch = scan[i];

        if (inString) {
          if (isCapturing) capture += ch;
          if (escaped) {
            if (!isCapturing) stringBuffer += ch;
            escaped = false;
            continue;
          }
          if (ch === "\\") {
            escaped = true;
            continue;
          }
          if (ch === '"') {
            inString = false;
            if (!mappingBody && !isCapturing && stringBuffer === "mapping") {
              mappingState = 1;
            }
          } else if (!isCapturing) {
            stringBuffer += ch;
          }
          continue;
        }

        if (ch === '"') {
          inString = true;
          stringBuffer = "";
          if (isCapturing) capture += ch;
          continue;
        }

        if (!mappingBody) {
          if (mappingState === 0) {
            continue;
          }

          if (mappingState === 1) {
            if (/\s/.test(ch)) continue;
            if (ch === ":") {
              mappingState = 2;
            } else {
              mappingState = 0;
              i -= 1;
            }
            continue;
          }

          if (mappingState === 2) {
            if (/\s/.test(ch)) continue;
            if (ch === "{") {
              mappingBody = true;
              mappingStarted = true;
              mappingState = 0;
            } else {
              mappingState = 0;
              i -= 1;
            }
            continue;
          }

          continue;
        }

        if (ch === "{") {
          if (isCapturing) {
            captureDepth += 1;
            capture += ch;
            continue;
          }
          isCapturing = true;
          captureDepth = 1;
          capture = "{";
          continue;
        }

        if (ch === "}") {
          if (isCapturing) {
            captureDepth -= 1;
            capture += ch;
            if (captureDepth === 0) {
              isCapturing = false;
              try {
                const node = JSON.parse(capture);
                const normalized = normalizeMessage(node, emittedCount);
                if (normalized && !seenIds.has(normalized.id)) {
                  seenIds.add(normalized.id);
                  emittedCount += 1;
                  await onMessage(normalized);
                }
              } catch (_error) {
                // ignore malformed object fragments
              }
              capture = "";
            }
          } else if (mappingStarted) {
            mappingBody = false;
            mappingStarted = false;
          }
          continue;
        }

        if (isCapturing) capture += ch;
      }
    }

    return {
      title,
      emittedCount,
    };
  }

  async function exportConversationByStreaming(conversationId, locationUrl) {
    const endpoint = `${CONVERSATION_API_ENDPOINT}${conversationId}`;
    let writer = null;
    try {
      const headers = buildApiHeaders(endpoint);
      const res = await fetch(endpoint, {
        method: "GET",
        credentials: "include",
        cache: "no-cache",
        headers,
      });

      if (!res.ok || !res.body?.getReader) return null;

      const fallbackTitle = parseConversationTitle({
        title: document.title,
      }) || t("defaultTitle");
      const fileName = `${slugify(fallbackTitle || "chatgpt-session")}-${
        new Date().toISOString().slice(0, 10)
      }.md`;
      writer = await createStreamingMarkdownWriter(fileName);

      await writer.write(makeMarkdownHeader({
        title: fallbackTitle || t("defaultTitle"),
        url: locationUrl,
        source: t("streamSource"),
      }));

      const result = await parseConversationFromStream(
        res.body,
        async (message) => {
          await writer.write(formatMessageMarkdownBlock(message));
        },
      );

      if (result?.emittedCount > 0) {
        await writer.close();
        return {
          title: result.title || fallbackTitle || t("defaultTitle"),
          source: "api-stream",
        };
      }
      await writer.abort();
    } catch (_error) {
      if (writer) {
        try {
          await writer.abort();
        } catch (_abortError) {
          // ignore cleanup failures
        }
      }
    }

    return null;
  }

  function dedupeMessages(messages) {
    const seen = new Set();
    const result = [];
    for (const item of messages) {
      if (!item || seen.has(item.id)) continue;
      seen.add(item.id);
      result.push(item);
    }
    return result;
  }

  function parseConversationPayload(payload) {
    if (!payload || typeof payload !== "object") return [];

    if (Array.isArray(payload.messages)) {
      const parsed = payload.messages
        .map((msg, i) => normalizeMessage(msg, i))
        .filter(Boolean);
      return parsed.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    }

    const mapping = payload.mapping || payload.conversation?.mapping;
    if (!mapping || typeof mapping !== "object") return [];

    const visited = new Set();
    const ordered = [];
    const parseNode = (id) => {
      if (!id || visited.has(id)) return;
      visited.add(id);

      const node = mapping[id];
      if (!node || typeof node !== "object") return;

      const normalized = normalizeMessage(node, ordered.length);
      if (normalized) ordered.push(normalized);

      const children = Array.isArray(node.children) ? node.children : [];
      for (const childId of children) {
        parseNode(childId);
      }
    };

    const rootIds = Object.entries(mapping).reduce((acc, [id, node]) => {
      const parent = node?.parent;
      if (!parent || typeof parent !== "string" || !(parent in mapping)) {
        acc.push(id);
      }
      return acc;
    }, []);

    for (const rootId of rootIds) {
      parseNode(rootId);
    }

    if (ordered.length === 0) {
      let i = 0;
      for (const raw of Object.values(mapping)) {
        const normalized = normalizeMessage(raw, i++);
        if (normalized) ordered.push(normalized);
      }
    }

    const parsed = dedupeMessages(ordered);
    const hasTime = parsed.some((item) => Number(item.createdAt));
    return hasTime
      ? parsed.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
      : parsed;
  }

  function parseConversationTitle(payload) {
    if (!payload || typeof payload !== "object") return null;
    return payload.title || payload.conversation?.title || null;
  }

  async function fetchConversationByApi(conversationId) {
    try {
      const endpoint = `${CONVERSATION_API_ENDPOINT}${conversationId}`;
      const headers = buildApiHeaders(endpoint);
      const res = await fetch(endpoint, {
        method: "GET",
        credentials: "include",
        cache: "no-cache",
        headers,
      });

      if (!res.ok) return null;
      const payload = await res.json();
      const messages = parseConversationPayload(payload);
      if (messages.length) {
        return {
          messages,
          title: parseConversationTitle(payload),
          source: "api",
        };
      }
    } catch (_error) {
      return null;
    }
    return null;
  }

  async function collectMessages() {
    const conversationId = getConversationIdFromUrl();
    if (!conversationId) return null;

    const apiResult = await fetchConversationByApi(conversationId);
    return apiResult?.messages?.length ? apiResult : null;
  }

  function buildMarkdown({ title, url, source, messages }) {
    const lines = [];
    lines.push(`# ${title || t("defaultTitle")}`);
    lines.push("");
    lines.push(`- ${t("exportedAt")}：${new Date().toLocaleString()}`);
    lines.push(`- ${t("link")}：${url}`);
    lines.push(
      `- ${t("source")}：${source === "api" ? t("apiSource") : source}`,
    );
    lines.push("");
    lines.push("---");
    lines.push("");

    if (!messages || messages.length === 0) {
      lines.push(t("emptyConversation"));
      return lines.join("\n");
    }

    for (const m of messages) {
      lines.push(`## ${m.role}`);
      lines.push("");
      lines.push(m.text);
      if (m.attachments && m.attachments.length > 0) {
        lines.push("");
        lines.push(...formatAttachmentLines(m.attachments));
      }
      lines.push("");
    }

    return lines.join("\n");
  }

  function slugify(value) {
    return (value || "chatgpt-session")
      .toLowerCase()
      .replace(/[^\u4e00-\u9fa5a-z0-9\-_]+/gi, "-")
      .replace(/(^-+)|(-+$)/g, "")
      .slice(0, 50) || "chatgpt-session";
  }

  async function downloadMarkdown() {
    const button = document.querySelector(`#${BUTTON_ID}`);
    if (!button) return;

    const original = getExportButtonLabel(button);
    setExportButtonLabel(button, t("loadingText"));
    button.disabled = true;

    try {
      const conversationId = getConversationIdFromUrl();
      if (conversationId && canUseStreamingDownload()) {
        const streamResult = await exportConversationByStreaming(
          conversationId,
          location.href,
        );
        if (streamResult && streamResult.source === "api-stream") {
          setExportButtonLabel(button, original);
          button.disabled = false;
          return;
        }
        throw new Error("Streaming export did not return exportable messages.");
      }

      const payload = await collectMessages();
      if (!payload?.messages?.length) {
        throw new Error("Conversation API did not return exportable messages.");
      }
      const markdown = buildMarkdown({
        title: payload.title,
        url: location.href,
        source: payload.source,
        messages: payload.messages,
      });
      const blob = new Blob([markdown], {
        type: "text/markdown;charset=utf-8",
      });
      const filename = `${slugify(payload.title)}-${
        new Date().toISOString().slice(0, 10)
      }.md`;
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
    } catch (error) {
      console.error(t("exportFailedLog"), error);
      window.alert(t("exportFailedAlert"));
      setExportButtonLabel(button, t("errorText"));
      await new Promise((resolve) => setTimeout(resolve, 1200));
    } finally {
      setExportButtonLabel(button, original);
      button.disabled = false;
    }
  }

  function getExportButtonLabel(button) {
    return button.querySelector("[data-export-md-label]")?.textContent ||
      button.textContent || t("buttonText");
  }

  function createDownloadIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.75");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    svg.classList.add("icon");
    svg.style.display = "block";
    svg.style.flexShrink = "0";

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4");
    svg.appendChild(path);

    const polyline = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polyline",
    );
    polyline.setAttribute("points", "7 10 12 15 17 10");
    svg.appendChild(polyline);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", "12");
    line.setAttribute("x2", "12");
    line.setAttribute("y1", "15");
    line.setAttribute("y2", "3");
    svg.appendChild(line);

    return svg;
  }

  function setExportButtonLabel(button, label) {
    let container = button.querySelector("[data-export-md-content]");
    let labelNode = button.querySelector("[data-export-md-label]");
    if (!container || !labelNode) {
      container = document.createElement("div");
      container.dataset.exportMdContent = "true";
      container.className = "flex w-full items-center justify-center gap-1.5";
      container.appendChild(createDownloadIcon());
      labelNode = document.createElement("span");
      labelNode.dataset.exportMdLabel = "true";
      container.appendChild(labelNode);
      button.replaceChildren(container);
    }
    labelNode.textContent = label;
    button.setAttribute("aria-label", label);
  }

  function setExportButtonIconOnly(button, iconOnly) {
    button.dataset.exportMdIconOnly = iconOnly ? "true" : "false";
    const labelNode = button.querySelector("[data-export-md-label]");
    if (labelNode) {
      labelNode.style.display = iconOnly ? "none" : "";
    }
    if (!iconOnly) hideExportTooltip();
  }

  function getOrCreateTooltip() {
    const existing = document.getElementById(TOOLTIP_ID);
    if (existing) return existing;

    const tooltip = document.createElement("div");
    tooltip.id = TOOLTIP_ID;
    tooltip.role = "tooltip";
    tooltip.textContent = t("buttonText");
    tooltip.style.position = "fixed";
    tooltip.style.zIndex = "2147483647";
    tooltip.style.display = "none";
    tooltip.style.pointerEvents = "none";
    tooltip.style.whiteSpace = "nowrap";
    tooltip.style.padding = "6px 9px";
    tooltip.style.borderRadius = "8px";
    tooltip.style.background = "rgb(13, 13, 13)";
    tooltip.style.color = "white";
    tooltip.style.fontSize = "12px";
    tooltip.style.fontWeight = "600";
    tooltip.style.lineHeight = "16px";
    tooltip.style.fontFamily = "inherit";
    tooltip.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.18)";
    document.body.appendChild(tooltip);
    return tooltip;
  }

  function hideExportTooltip() {
    const tooltip = document.getElementById(TOOLTIP_ID);
    if (tooltip) tooltip.style.display = "none";
  }

  function showExportTooltip(button) {
    if (button.dataset.exportMdIconOnly !== "true") return;
    const tooltip = getOrCreateTooltip();
    tooltip.textContent = t("buttonText");
    tooltip.style.visibility = "hidden";
    tooltip.style.display = "block";

    const buttonRect = button.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const gap = 8;
    const viewportPadding = 8;
    const left = Math.min(
      Math.max(
        buttonRect.left + (buttonRect.width - tooltipRect.width) / 2,
        viewportPadding,
      ),
      window.innerWidth - tooltipRect.width - viewportPadding,
    );
    const top = Math.min(
      buttonRect.bottom + gap,
      window.innerHeight - tooltipRect.height - viewportPadding,
    );

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${Math.max(viewportPadding, top)}px`;
    tooltip.style.visibility = "visible";
  }

  function updateExportTooltipPosition(button) {
    const tooltip = document.getElementById(TOOLTIP_ID);
    if (!tooltip || tooltip.style.display === "none") return;
    showExportTooltip(button);
  }

  function createButton() {
    const button = document.createElement("button");
    button.id = BUTTON_ID;
    button.type = "button";
    button.setAttribute("aria-label", t("buttonText"));
    button.className =
      "btn relative btn-ghost text-token-text-primary hover:bg-token-surface-hover rounded-lg export-md-button";
    button.style.marginLeft = "0";
    button.addEventListener("click", downloadMarkdown);
    button.addEventListener("mouseenter", () => showExportTooltip(button));
    button.addEventListener("mouseleave", hideExportTooltip);
    button.addEventListener("focus", () => showExportTooltip(button));
    button.addEventListener("blur", hideExportTooltip);
    setExportButtonLabel(button, t("buttonText"));
    return button;
  }

  function getOrCreateWrapper() {
    const existing = document.getElementById(BUTTON_WRAPPER_ID);
    if (existing) return existing;

    const wrapper = document.createElement("div");
    wrapper.id = BUTTON_WRAPPER_ID;
    wrapper.style.position = "fixed";
    wrapper.style.top = "0px";
    wrapper.style.left = "0px";
    wrapper.style.zIndex = "2147483647";
    wrapper.style.display = "none";
    wrapper.style.pointerEvents = "none";
    const button = createButton();
    button.style.pointerEvents = "auto";
    wrapper.appendChild(button);
    document.body.appendChild(wrapper);
    return wrapper;
  }

  function positionButtonNearHeaderActions(actionsContainer) {
    const wrapper = getOrCreateWrapper();
    const button = wrapper.querySelector("button");
    if (!button) return;

    if (!actionsContainer || !document.body.contains(actionsContainer)) {
      wrapper.style.display = "none";
      hideExportTooltip();
      return;
    }

    const actionsRect = actionsContainer.getBoundingClientRect();
    if (actionsRect.width === 0 || actionsRect.height === 0) {
      wrapper.style.display = "none";
      hideExportTooltip();
      return;
    }

    const firstAction = findFirstVisibleHeaderAction(actionsContainer);
    const lastAction = findLastVisibleHeaderAction(actionsContainer);
    const iconOnly = shouldUseIconOnlyButton(actionsContainer, actionsRect);
    const styleAnchor = iconOnly ? lastAction : firstAction || lastAction;
    button.className = `${
      sanitizeButtonClassName(styleAnchor?.className || "")
    } export-md-button`;
    button.style.marginLeft = "0";
    button.style.pointerEvents = "auto";
    button.style.viewTransitionName = "none";
    button.setAttribute("aria-label", t("buttonText"));
    setExportButtonIconOnly(button, iconOnly);

    wrapper.style.visibility = "hidden";
    wrapper.style.display = "block";
    const buttonRect = button.getBoundingClientRect();
    const viewportPadding = 8;

    let top = actionsRect.top;
    const right = getExportButtonRightOffset(
      actionsRect,
      viewportPadding,
      actionsContainer,
    );

    if (top + buttonRect.height > window.innerHeight - viewportPadding) {
      top = window.innerHeight - buttonRect.height - viewportPadding;
    }
    if (top < viewportPadding) top = viewportPadding;

    wrapper.style.top = `${Math.max(0, top)}px`;
    wrapper.style.left = "auto";
    wrapper.style.right = `${right}px`;
    wrapper.style.display = "block";
    wrapper.style.visibility = "visible";
    updateExportTooltipPosition(button);
  }

  function getExportButtonRightOffset(
    actionsRect,
    viewportPadding,
    actionsContainer,
  ) {
    const viewportWidth = window.innerWidth;
    const firstAction = findFirstVisibleHeaderAction(actionsContainer);
    if (firstAction) {
      const visualLeft = firstAction.getBoundingClientRect().left;
      return Math.max(viewportPadding, viewportWidth - visualLeft);
    }

    if (!isCompactHeaderActions(actionsRect)) return EXPORT_RIGHT_WIDE;
    if (actionsRect.width <= 96) {
      return Math.max(viewportPadding, viewportWidth - actionsRect.left);
    }
    return EXPORT_RIGHT_COMPACT_WIDE;
  }

  let positionRafId = 0;
  function schedulePosition(actionsContainer) {
    if (positionRafId) return;
    positionRafId = window.requestAnimationFrame(() => {
      positionRafId = 0;
      positionButtonNearHeaderActions(actionsContainer);
    });
  }

  function isCompactHeaderActions(actionsRect) {
    return actionsRect.width <= 220;
  }

  function shouldUseIconOnlyButton(actionsContainer, actionsRect) {
    const firstAction = findFirstVisibleHeaderAction(actionsContainer);
    if (firstAction && firstAction.getBoundingClientRect().width > 48) {
      return false;
    }
    return isCompactHeaderActions(actionsRect);
  }

  function isVisibleElement(element) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    const styles = window.getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && styles.display !== "none" &&
      styles.visibility !== "hidden";
  }

  function sanitizeButtonClassName(className) {
    return String(className || "")
      .split(/\s+/)
      .filter((name) =>
        name && name !== "hidden" && !name.endsWith(":hidden") &&
        name !== "invisible" && !name.endsWith(":invisible")
      )
      .join(" ");
  }

  function findHeaderRightActions() {
    const container = document.querySelector(
      'header#page-header [data-testid="thread-header-right-actions-container"], [data-testid="thread-header-right-actions-container"]',
    );
    if (container) return container;

    const inner = document.querySelector(
      'header#page-header [data-testid="thread-header-right-actions"], [data-testid="thread-header-right-actions"]',
    );
    if (inner) return inner;

    const header = document.querySelector("header#page-header");
    if (!header) return null;
    return Array.from(header.children).reverse().find((child) =>
      isVisibleElement(child)
    ) || null;
  }

  function findLastVisibleHeaderAction(actionsContainer) {
    const actions = Array.from(actionsContainer.querySelectorAll("button, a"))
      .filter((item) => isVisibleElement(item));
    return actions.length ? actions[actions.length - 1] : null;
  }

  function findFirstVisibleHeaderAction(actionsContainer) {
    const actions = Array.from(actionsContainer.querySelectorAll("button, a"))
      .filter((item) => isVisibleElement(item));
    return actions.length ? actions[0] : null;
  }

  function ensureExportButton() {
    const rightActions = findHeaderRightActions();
    if (!rightActions) {
      const wrapper = document.getElementById(BUTTON_WRAPPER_ID);
      if (wrapper) wrapper.style.display = "none";
      hideExportTooltip();
      return;
    }

    schedulePosition(rightActions);
  }

  function bootstrap() {
    ensureExportButton();
    const observer = new MutationObserver(() => ensureExportButton());
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", () => ensureExportButton());
    window.addEventListener("scroll", () => ensureExportButton(), true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  } else {
    bootstrap();
  }
})();
