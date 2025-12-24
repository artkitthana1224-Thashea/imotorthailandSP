
import { supabase } from './supabaseClient';

/**
 * Fetches the LINE configuration from Supabase system_config table.
 */
const getLineConfigFromDB = async () => {
  try {
    const { data, error } = await supabase
      .from('system_config')
      .select('config_key, config_value');

    if (error) {
      console.error("Supabase error fetching LINE config:", error.message);
      return null;
    }
    
    if (!data || data.length === 0) return null;

    const config: Record<string, string> = {};
    data.forEach((item: any) => {
      config[item.config_key] = item.config_value;
    });

    return {
      accessToken: config['LINE_ACCESS_TOKEN'],
      groupId: config['LINE_GROUP_ID'],
      channelSecret: config['LINE_CHANNEL_SECRET']
    };
  } catch (err) {
    console.error("Critical error fetching LINE config:", err);
    return null;
  }
};

/**
 * Sends a notification to the configured LINE group using a CORS proxy.
 */
export const sendWorkOrderNotification = async (data: {
  orderNumber: string;
  status: string;
  customerName: string;
  issue: string;
  creator: string;
  isUpdate?: boolean;
}) => {
  const config = await getLineConfigFromDB();
  
  if (!config || !config.accessToken || !config.groupId) {
    console.warn("LINE Configuration missing. Please set keys in Settings > Integrations.");
    return { success: false, error: 'CONFIG_MISSING' };
  }

  const title = data.isUpdate ? `🔄 อัปเดตสถานะงานซ่อม` : `📦 ใบงานใหม่`;
  const messageText = `${title}\n------------------\nเลขที่: ${data.orderNumber}\nลูกค้า: ${data.customerName || '-'}\nอาการ: ${data.issue || '-'}\nสถานะ: ${data.status}\nโดย: ${data.creator || 'Admin'}`;

  const payload = {
    to: config.groupId,
    messages: [
      {
        type: "text",
        text: messageText
      }
    ]
  };

  try {
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
      let userFriendlyError = "ไม่สามารถส่งแจ้งเตือน LINE ได้";
      
      if (response.status === 401) userFriendlyError = "LINE Access Token ไม่ถูกต้อง";
      if (response.status === 400) userFriendlyError = "ข้อมูลการส่งแจ้งเตือนไม่ถูกต้อง (Bad Request)";
      
      console.error(`LINE API Error (${response.status}):`, errText);
      return { success: false, error: userFriendlyError, details: errText };
    }

    console.log("LINE Notification sent successfully for", data.orderNumber);
    return { success: true };
  } catch (err: any) {
    console.error("Network error sending LINE notification:", err.message);
    return { success: false, error: "เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย", details: err.message };
  }
};
