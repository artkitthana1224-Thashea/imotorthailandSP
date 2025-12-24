
import { supabase } from './supabaseClient';
import { WorkOrderStatus } from '../types';

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

const getStatusColor = (status: string) => {
  switch (status) {
    case WorkOrderStatus.COMPLETED: return "#10b981";
    case WorkOrderStatus.IN_PROGRESS: return "#2563eb";
    case WorkOrderStatus.WAITING_PARTS: return "#f59e0b";
    case WorkOrderStatus.CANCELLED: return "#f43f5e";
    default: return "#64748b";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case WorkOrderStatus.COMPLETED: return "จบงานซ่อมเสร็จสิ้น";
    case WorkOrderStatus.IN_PROGRESS: return "กำลังดำเนินการซ่อม";
    case WorkOrderStatus.WAITING_PARTS: return "รออะไหล่ / สั่งของ";
    case WorkOrderStatus.CANCELLED: return "ยกเลิกรายการซ่อม";
    default: return "อัปเดตสถานะงานซ่อม";
  }
};

export const sendLineNotification = async (flexPayload: any) => {
  const config = await getLineConfigFromDB();
  if (!config || !config.accessToken || !config.groupId) return { success: false, error: 'CONFIG_MISSING' };

  const payload = {
    to: config.groupId,
    messages: [
      {
        type: "flex",
        altText: "I-MOTOR Service Update",
        contents: flexPayload
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
  totalAmount?: number;
  parts?: any[];
  isUpdate?: boolean;
}) => {
  const statusColor = getStatusColor(data.status);
  const statusLabel = getStatusLabel(data.status);
  
  // Build Parts String
  const partsText = data.parts && data.parts.length > 0 
    ? data.parts.map(p => `• ${p.name} (x${p.quantity})`).join('\n')
    : "ไม่มี";

  const flexPayload = {
    type: "bubble",
    header: {
      type: "box",
      layout: "vertical",
      contents: [
        { type: "text", text: "I-MOTOR CENTRAL SERVICE", color: "#ffffffcc", size: "xs", weight: "bold" },
        { type: "text", text: statusLabel, color: "#ffffff", size: "xl", weight: "bold", margin: "md" }
      ],
      backgroundColor: statusColor,
      paddingAll: "20px"
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "box",
          layout: "horizontal",
          contents: [
            { type: "box", layout: "vertical", contents: [
              { type: "text", text: "เลขใบงาน", size: "xs", color: "#aaaaaa", weight: "bold" },
              { type: "text", text: "วันที่", size: "xs", color: "#aaaaaa", weight: "bold" }
            ]},
            { type: "box", layout: "vertical", contents: [
              { type: "text", text: data.orderNumber, size: "sm", align: "end", weight: "bold", color: "#333333" },
              { type: "text", text: new Date().toLocaleDateString('th-TH'), size: "sm", align: "end", color: "#666666" }
            ]}
          ],
          margin: "md"
        },
        { type: "separator", margin: "xl" },
        {
          type: "box",
          layout: "vertical",
          contents: [
            { type: "text", text: "ลูกค้าและพื้นที่", weight: "bold", size: "md", margin: "xl" },
            { type: "text", text: `ชื่อ: ${data.customerName}`, size: "sm", color: "#666666", margin: "sm" },
            { type: "text", text: `อาการ: ${data.issue}`, size: "sm", color: "#666666", wrap: true, margin: "sm" }
          ]
        },
        { type: "separator", margin: "xl" },
        {
          type: "box",
          layout: "vertical",
          contents: [
            { type: "text", text: "อะไหล่ที่ใช้", weight: "bold", size: "md", margin: "xl" },
            { type: "text", text: partsText, size: "sm", color: "#10b981", wrap: true, margin: "sm", weight: "bold" }
          ]
        },
        {
          type: "box",
          layout: "horizontal",
          contents: [
            { type: "text", text: "รวมสุทธิ", size: "sm", color: "#aaaaaa", weight: "bold" },
            { type: "text", text: `฿${data.totalAmount?.toLocaleString() || '0'}`, size: "xl", align: "end", weight: "bold", color: "#2563eb" }
          ],
          margin: "xl"
        }
      ]
    },
    footer: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "box",
          layout: "horizontal",
          contents: [
            { type: "text", text: "ผู้รับผิดชอบ", size: "xs", color: "#aaaaaa", weight: "bold" },
            { type: "text", text: data.creator, size: "sm", align: "end", weight: "bold", color: "#333333" }
          ]
        }
      ],
      paddingAll: "20px"
    }
  };

  return sendLineNotification(flexPayload);
};

export const sendInventoryAlert = async (partName: string, sku: string, currentStock: number) => {
  const flexPayload = {
    type: "bubble",
    header: {
      type: "box",
      layout: "vertical",
      contents: [
        { type: "text", text: "STOCK ALERT", color: "#ffffffcc", size: "xs", weight: "bold" },
        { type: "text", text: "แจ้งเตือนสต็อกต่ำ!", color: "#ffffff", size: "xl", weight: "bold", margin: "md" }
      ],
      backgroundColor: "#f43f5e"
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        { type: "text", text: partName, weight: "bold", size: "md" },
        { type: "text", text: `SKU: ${sku}`, size: "xs", color: "#aaaaaa", margin: "xs" },
        { type: "text", text: `คงเหลือเพียง: ${currentStock} ชิ้น`, size: "lg", color: "#f43f5e", weight: "bold", margin: "lg" }
      ]
    }
  };
  return sendLineNotification(flexPayload);
};
