import React, { useState } from "react";
import axios from "axios";

interface Item {
  itemName: string;
  itemAmount: number;
  itemPrice: number;
}

interface InvoiceData {
  businessName: string;
  businessNumber: string;
  issueDate: string;
  deliveryNoteNumber?: string;
  customerName: string;
  customerAddress: string;
  goodsDescription: Item[];
  totalAmount: number;
  customerEmail: string;
  logo: string;
}

const InvoiceForm: React.FC = () => {
  const [language, setLanguage] = useState<"en" | "he">("en");
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    businessName: "",
    businessNumber: "",
    issueDate: "",
    customerName: "",
    customerAddress: "",
    customerEmail: "john@example.com",
    goodsDescription: [],
    totalAmount: 0,
    logo: "https://github.com/user-attachments/assets/c7204bb0-f62d-41bc-b3fb-012073cd3d16",
  });

  const [item, setItem] = useState<Item>({
    itemName: "",
    itemAmount: 0,
    itemPrice: 0,
  });

  const handleAddItem = () => {
    const updatedGoods = [...invoiceData.goodsDescription, item];
    const updatedTotalAmount = updatedGoods.reduce(
      (sum, i) => sum + i.itemAmount * i.itemPrice,
      0
    );
    setInvoiceData({
      ...invoiceData,
      goodsDescription: updatedGoods,
      totalAmount: updatedTotalAmount,
    });
    setItem({ itemName: "", itemAmount: 0, itemPrice: 0 });
  };

  const handleSubmit = async (e: React.FormEvent, isRtl: boolean) => {
    const ltrAddress = "http://localhost:6543/api/generate-pdf/ltr";
    const rtlAddress = "http://localhost:6543/api/generate-pdf/rtl";
    e.preventDefault();
    try {
      const response = await axios.post(
        isRtl ? rtlAddress : ltrAddress,
        invoiceData,
        {
          responseType: "blob",
        }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "invoice.pdf";
      link.click();
    } catch (error) {
      console.error("Error generating PDF", error);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("value: ", value);
    console.log("Number(e.target.value): ", Number(e.target.value));
    if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
      setItem({ ...item, itemPrice: parseFloat(value) || 0 });
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    console.log("value: ", value);
    console.log("Number(e.target.value): ", Number(e.target.value));
    if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
      setItem({ ...item, itemAmount: Number(e.target.value) || 0 });
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
        fontFamily: "Arial",
      }}
    >
      <h1>{language === "en" ? "Generate Invoice" : "צור חשבונית"}</h1>
      <div>
        <button
          onClick={() => setLanguage("en")}
          style={{ marginRight: "10px", cursor: "pointer" }}
        >
          English
        </button>
        <button onClick={() => setLanguage("he")} style={{ cursor: "pointer" }}>
          עברית
        </button>
      </div>
      <form
        onSubmit={(e) => handleSubmit(e, language === "he")}
        style={{ direction: language === "he" ? "rtl" : "ltr" }}
      >
        <div style={{ marginBottom: "10px" }}>
          <label>{language === "en" ? "Business Name:" : "שם העסק:"}</label>
          <input
            type='text'
            value={invoiceData.businessName}
            onChange={(e) =>
              setInvoiceData({ ...invoiceData, businessName: e.target.value })
            }
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>{language === "en" ? "Business Number:" : "מספר עסק:"}</label>
          <input
            type='text'
            value={invoiceData.businessNumber}
            onChange={(e) =>
              setInvoiceData({ ...invoiceData, businessNumber: e.target.value })
            }
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>{language === "en" ? "Issue Date:" : "תאריך הוצאה:"}</label>
          <input
            type='date'
            value={invoiceData.issueDate}
            onChange={(e) =>
              setInvoiceData({ ...invoiceData, issueDate: e.target.value })
            }
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>
            {language === "en" ? "Delivery Note Number:" : "מספר תעודת משלוח:"}
          </label>
          <input
            type='text'
            value={invoiceData.deliveryNoteNumber || ""}
            onChange={(e) =>
              setInvoiceData({
                ...invoiceData,
                deliveryNoteNumber: e.target.value,
              })
            }
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>{language === "en" ? "Customer Name:" : "שם הלקוח:"}</label>
          <input
            type='text'
            value={invoiceData.customerName}
            onChange={(e) =>
              setInvoiceData({ ...invoiceData, customerName: e.target.value })
            }
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>{language === "en" ? "Customer Email:" : "מייל הלקוח:"}</label>
          <input
            type='text'
            value={invoiceData.customerEmail}
            onChange={(e) =>
              setInvoiceData({ ...invoiceData, customerEmail: e.target.value })
            }
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>
            {language === "en" ? "Customer Address:" : "כתובת הלקוח:"}
          </label>
          <input
            type='text'
            value={invoiceData.customerAddress}
            onChange={(e) =>
              setInvoiceData({
                ...invoiceData,
                customerAddress: e.target.value,
              })
            }
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>{language === "en" ? "Items:" : "פריטים:"}</label>
          {invoiceData.goodsDescription.map((item, index) => (
            <div
              key={index}
              style={{
                padding: "8px",
                marginBottom: "5px",
                border: "1px solid #ccc",
              }}
            >
              {item.itemName} - {item.itemAmount} x ₪{item.itemPrice.toFixed(2)}
            </div>
          ))}
          <div style={{ display: "flex", marginTop: "10px" }}>
            <input
              type='text'
              placeholder={language === "en" ? "Item Name" : "שם הפריט"}
              value={item.itemName}
              onChange={(e) => setItem({ ...item, itemName: e.target.value })}
              style={{ flex: 2, padding: "8px", marginRight: "10px" }}
            />
            <input
              type='number'
              placeholder={language === "en" ? "Amount" : "כמות"}
              value={item.itemAmount === 0 ? "" : item.itemAmount}
              onChange={handleAmountChange}
              style={{ flex: 1, padding: "8px", marginRight: "10px" }}
            />
            <input
              type='number'
              placeholder={language === "en" ? "Price" : "מחיר"}
              value={item.itemPrice === 0 ? "" : item.itemPrice}
              onChange={handlePriceChange}
              style={{ flex: 1, padding: "8px" }}
            />
            <button
              type='button'
              onClick={handleAddItem}
              style={{
                marginLeft: "10px",
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              {language === "en" ? "Add Item" : "הוסף פריט"}
            </button>
          </div>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>
            {language === "en"
              ? `Total Amount: ₪${invoiceData.totalAmount.toFixed(2)}`
              : `סכום כולל: ₪${invoiceData.totalAmount.toFixed(2)}`}
          </label>
        </div>
        <button
          type='submit'
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          {language === "en" ? "Generate PDF" : "צור PDF"}
        </button>
      </form>
    </div>
  );
};

export default InvoiceForm;
