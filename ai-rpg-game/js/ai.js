/* ═══════════════════════════════════════════
   命运织机 — AI 调用层
   OpenAI 兼容格式，支持 SenseNova / OpenRouter / vLLM / Ollama
   ═══════════════════════════════════════════ */

class AIClient {
  constructor({ baseUrl, apiKey, model }) {
    this.baseUrl  = (baseUrl || '').replace(/\/+$/, '');
    this.apiKey   = apiKey || '';
    this.model    = model  || 'sensenova-6.7-flash-lite';
    this.temperature  = 0.9;
    this.maxTokens    = 4096;
    this.timeoutMs    = 180000; // 3 min
    this.lastCall     = 0;
    this.minInterval  = 2000; // 防抖 2 秒
  }

  /* 更新配置 */
  update({ baseUrl, apiKey, model, temperature, maxTokens }) {
    if (baseUrl  !== undefined) this.baseUrl = baseUrl.replace(/\/+$/, '');
    if (apiKey   !== undefined) this.apiKey  = apiKey;
    if (model    !== undefined) this.model   = model;
    if (temperature !== undefined) this.temperature = temperature;
    if (maxTokens !== undefined) this.maxTokens = maxTokens;
  }

  /* 验证配置是否完整 */
  isValid() {
    return !!(this.baseUrl && this.apiKey && this.model);
  }

  /* 拼接完整 URL */
  _endpoint() {
    return this.baseUrl + (this.baseUrl.includes('/chat/completions') ? '' : '/chat/completions');
  }

  /* 检测是否为 vLLM / FastChat 风格（需要 prefix=v1） */
  _isVllmStyle() {
    return this.baseUrl.includes('vllm') || this.baseUrl.includes('fastchat');
  }

  async call(messages, { temperature, maxTokens, stream = false } = {}) {
    // 防抖
    const now = Date.now();
    if (now - this.lastCall < this.minInterval) {
      await new Promise(r => setTimeout(r, this.minInterval - (now - this.lastCall)));
    }

    const endpoint = this._endpoint();
    const body = {
      model:        this.model,
      messages:     messages,
      temperature:  temperature ?? this.temperature,
      max_tokens:   maxTokens   ?? this.maxTokens,
      stream:       stream,
    };

    // 某些端点要求额外字段
    if (this.baseUrl.includes('sensenova')) {
      body.frequency_penalty = 0;
      body.presence_penalty  = 0;
    }

    this.lastCall = Date.now();

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        let err;
        try {
          err = JSON.parse(errText);
        } catch (_) {
          err = { error: { message: errText || `HTTP ${response.status}` } };
        }
        throw new Error(`AI 请求失败 [${response.status}]: ${err.error?.message || err.message || '未知错误'}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error('AI 返回内容为空');

      // 统计 token 使用量
      const usage = data.usage || {};
      return { content, usage };

    } catch (e) {
      if (e.name === 'AbortError') {
        throw new Error('请求超时（120s），请检查网络连接或 API 端点');
      }
      throw e;
    }
  }

  /* 流式调用 */
  async streamCall(messages, onChunk) {
    const endpoint = this._endpoint();
    const body = {
      model:       this.model,
      messages:    messages,
      temperature: this.temperature,
      max_tokens:  this.maxTokens,
      stream:      true,
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error(`流式请求失败 [${response.status}]`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // 按行解析 SSE
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;
          if (!trimmed.startsWith('data:')) continue;
          try {
            const json = JSON.parse(trimmed.slice(5));
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) onChunk(delta);
          } catch (_) { /* 忽略解析错误 */ }
        }
      }
    } catch (e) {
      onChunk(`\n⚠️ 流式连接出错：${e.message}`);
    }
  }
}
