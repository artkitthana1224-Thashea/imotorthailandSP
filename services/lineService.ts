
import { supabase } from './supabaseClient';

/**
 * Fetches the LINE configuration from Supabase.
 */
const getLineConfigFromDB = async () => {
  try {
    const { data, error } = await supabase
      .from('system_config')
      .select('config_key, config_value');

    if (error || !data) return null;

    const config: Record<string, string> = {};
    data.forEach((item: any) => {
      config[item.config_key] = item.config_value;
    });

    return {
      accessToken: config['LINE_ACCESS_TOKEN'],
      groupId: config['LINE_GROUP_ID']
    };
  } catch (err) {
    console.error("Database error fetching LINE config:", err);
    return null;
  }
};

/**
 * Sends a notification to the configured LINE group.
 * Uses a proxy to avoid browser CORS errors.
 */
export const sendWorkOrderNotification = async (data: any) => {
  const config = await getLineConfigFromDB();
  
  if (!config || !config.accessToken || !config.groupId) {
    console.warn("LINE Configuration missing in Supabase system_config table.");
    return { success: false, error: 'CONFIG_MISSING' };
  }

  const payload = {
    to: config.groupId,
    messages: [
      {
        type: "text",
        text: `📦 ใบงานใหม่: ${data.orderNumber}\nลูกค้า: ${data.customerName || '-'}\nอาการ: ${data.issue || '-'}\nผู้รับเรื่อง: ${data.creator || 'Admin'}\nสถานะ: ${data.status}`
      }
    ]
  };

  try {
    // We use a CORS proxy because LINE API does not allow browser-based calls directly.
    const proxyUrl = 'https://corsproxy.io/?';
    const apiUrl = 'https://api.line.me/v2/bot/message/push';
    
    const response = await fetch(proxyUrl + encodeURIComponent(apiUrl), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.accessToken}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("LINE API Error:", errText);
      return { success: false, error: errText };
    }

    return { success: true };
  } catch (err: any) {
    console.error("LINE Notify Network Error:", err.message);
    return { success: false, error: err.message };
  }
};
