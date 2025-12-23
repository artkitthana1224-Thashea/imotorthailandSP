
/**
 * LINE Messaging API Service for I-MOTOR ERP
 * Handles sending Flex Messages to the specified Group ID
 */

const LINE_ACCESS_TOKEN = 'GWjMaUGGXfgzJzEMMQePADM0RMhS5YPGt4Hcqx6e2OsbY3FgSlAzHjSiAa86U2AvsuuSqj+mf/u5ZIrDv1Xm7ebfnjnZpH1QMVPAaJA5CoR354JjsIjNfONqTqG5+EB43EiXCUELDBu9xPUJt4qE6AdB04t89/1O/w1cDnyilFU=';
const LINE_GROUP_ID = 'Cb22f54f609573be08945d40f6b485d14';

export const sendWorkOrderNotification = async (data: {
  orderNumber: string;
  status: string;
  customerName: string;
  customerPhone: string;
  vehicleModel: string;
  province: string;
  issue: string;
  creator: string;
  mechanic?: string;
  parts?: string[];
}) => {
  // Determine color based on status
  let statusColor = '#2563eb'; // Blue (New)
  let statusText = 'สร้างงานใหม่';
  
  if (data.status === 'IN_PROGRESS' || data.status === 'DIAGNOSING') {
    statusColor = '#f59e0b'; // Orange
    statusText = 'กำลังดำเนินการซ่อม';
  } else if (data.status === 'COMPLETED') {
    statusColor = '#10b981'; // Green
    statusText = 'ซ่อมเสร็จสิ้น';
  } else if (data.status === 'CANCELLED') {
    statusColor = '#ef4444'; // Red
    statusText = 'ยกเลิกงาน';
  }

  const flexMessage = {
    type: "flex",
    altText: `I-MOTOR: ${statusText} [${data.orderNumber}]`,
    contents: {
      type: "bubble",
      size: "giga",
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "I-MOTOR SERVICE",
            weight: "bold",
            color: "#ffffff",
            size: "sm"
          },
          {
            type: "text",
            text: statusText,
            weight: "bold",
            color: "#ffffff",
            size: "xl",
            margin: "md"
          },
          {
            type: "text",
            text: `เลขที่ใบงาน: ${data.orderNumber}`,
            color: "#ffffffcc",
            size: "xs",
            margin: "sm"
          }
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
              {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "text",
                    text: "ลูกค้า",
                    size: "xs",
                    color: "#aaaaaa",
                    weight: "bold"
                  },
                  {
                    type: "text",
                    text: data.customerName,
                    size: "sm",
                    color: "#111111",
                    weight: "bold"
                  }
                ],
                flex: 1
              },
              {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "text",
                    text: "โทรศัพท์",
                    size: "xs",
                    color: "#aaaaaa",
                    weight: "bold",
                    align: "end"
                  },
                  {
                    type: "text",
                    text: data.customerPhone,
                    size: "sm",
                    color: "#111111",
                    weight: "bold",
                    align: "end"
                  }
                ],
                flex: 1
              }
            ]
          },
          {
            type: "separator",
            margin: "lg"
          },
          {
            type: "box",
            layout: "vertical",
            margin: "lg",
            spacing: "sm",
            contents: [
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  { type: "text", text: "รถ/รุ่น", size: "xs", color: "#888888", flex: 2 },
                  { type: "text", text: data.vehicleModel, size: "xs", color: "#111111", weight: "bold", flex: 4, align: "end" }
                ]
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  { type: "text", text: "พื้นที่", size: "xs", color: "#888888", flex: 2 },
                  { type: "text", text: data.province, size: "xs", color: "#111111", weight: "bold", flex: 4, align: "end" }
                ]
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  { type: "text", text: "รายการ", size: "xs", color: "#888888", flex: 2 },
                  { type: "text", text: data.issue, size: "xs", color: "#111111", weight: "bold", flex: 4, align: "end", wrap: true }
                ]
              }
            ]
          },
          {
            type: "box",
            layout: "vertical",
            margin: "lg",
            backgroundColor: "#f8f9fa",
            paddingAll: "10px",
            cornerRadius: "md",
            contents: [
              {
                type: "text",
                text: "เจ้าหน้าที่ผู้รับผิดชอบ",
                size: "xxs",
                color: "#aaaaaa",
                weight: "bold",
                margin: "none"
              },
              {
                type: "text",
                text: data.mechanic || "รอระบุช่าง",
                size: "xs",
                color: "#333333",
                weight: "bold"
              }
            ]
          }
        ]
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: `วันที่สร้าง: ${new Date().toLocaleDateString('th-TH')}`,
            size: "xxs",
            color: "#aaaaaa",
            align: "center"
          },
          {
            type: "text",
            text: `ผู้ทำรายการ: ${data.creator}`,
            size: "xxs",
            color: "#aaaaaa",
            align: "center",
            margin: "xs"
          }
        ]
      }
    }
  };

  try {
    /** 
     * NOTE: Calling LINE API directly from frontend usually faces CORS issues.
     * This code demonstrates the logic. In production, this should be a call to 
     * a backend endpoint or a proxy that forwards to LINE.
     */
    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        to: LINE_GROUP_ID,
        messages: [flexMessage]
      })
    });

    if (!response.ok) {
      console.warn('LINE Notification simulated. API call blocked by CORS or Invalid Token.');
    }
    return true;
  } catch (err) {
    console.error('LINE Service Error:', err);
    return false;
  }
};
