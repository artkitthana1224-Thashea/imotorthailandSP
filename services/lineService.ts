
import { supabase } from './supabaseClient';

const getLineConfigFromDB = async () => {
  try {
    const { data, error } = await supabase
      .from('system_config')
      .select('config_key, config_value');

    if (error) return null;
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
    return null;
  }
};

export const sendLineNotification = async (messageText: string) => {
  const config = await getLineConfigFromDB();
  if (!config || !config.accessToken || !config.groupId) return { success: false, error: 'CONFIG_MISSING' };

  const payload = {
    to: config.groupId,
    messages: [{ type: "text", text: messageText }]
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
    return { success: response.ok };
  } catch (err) {
    return { success: false };
  }
};

export const sendWorkOrderNotification = async (data: {
  orderNumber: string;
  status: string;
  customerName: string;
  issue: string;
  creator: string;
  isUpdate?: boolean;
}) => {
  const title = data.isUpdate ? `🔄 อัปเดตสถานะงานซ่อม` : `📦 ใบงานใหม่`;
  const messageText = `${title}\n------------------\nเลขที่: ${data.orderNumber}\nลูกค้า: ${data.customerName || '-'}\nอาการ: ${data.issue || '-'}\nสถานะ: ${data.status}\nโดย: ${data.creator || 'Admin'}`;
  return sendLineNotification(messageText);
};

export const sendInventoryAlert = async (partName: string, sku: string, currentStock: number) => {
  const messageText = `⚠️ แจ้งเตือนสต็อกต่ำ!\n------------------\nอะไหล่: ${partName}\nSKU: ${sku}\nคงเหลือ: ${currentStock} ชิ้น\nกรุณาตรวจสอบและสั่งซื้อเพิ่มเติม`;
  return sendLineNotification(messageText);
};
