import { base44 } from "@/api/base44Client";

export async function trackUsage(metric, value = 1, metadata = {}) {
  try {
    const period = new Date().toISOString().slice(0, 7);
    await base44.entities.UsageRecord.create({ metric, value, metadata, period });
  } catch (err) {
    console.error("Failed to track usage:", err);
  }
}

export async function getUserUsage(period) {
  try {
    const currentPeriod = period || new Date().toISOString().slice(0, 7);
    const records = await base44.entities.UsageRecord.filter({ period: currentPeriod }, "-created_date", 500);
    const summary = {
      ai_messages: 0,
      tokens: 0,
      file_uploads: 0,
      storage: 0,
      code_executions: 0,
      api_requests: 0,
    };
    for (const record of records) {
      if (summary[record.metric] !== undefined) {
        summary[record.metric] += record.value || 0;
      }
    }
    return summary;
  } catch (err) {
    console.error("Failed to load usage:", err);
    return { ai_messages: 0, tokens: 0, file_uploads: 0, storage: 0, code_executions: 0, api_requests: 0 };
  }
}