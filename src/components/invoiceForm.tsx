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
}

const InvoiceForm: React.FC = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    businessName: "",
    businessNumber: "",
    issueDate: "",
    customerName: "",
    customerAddress: "",
    goodsDescription: [],
    totalAmount: 0,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:6543/generate-pdf",
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

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
        fontFamily: "Arial",
      }}
    >
      <h1>Generate Invoice</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Business Name:</label>
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
          <label>Business Number:</label>
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
          <label>Issue Date:</label>
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
          <label>Delivery Note Number:</label>
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
          <label>Customer Name:</label>
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
          <label>Customer Address:</label>
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
          <label>Items:</label>
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
              placeholder='Item Name'
              value={item.itemName}
              onChange={(e) => setItem({ ...item, itemName: e.target.value })}
              style={{ flex: 2, padding: "8px", marginRight: "10px" }}
            />
            <input
              type='number'
              placeholder='Amount'
              value={item.itemAmount}
              onChange={(e) =>
                setItem({ ...item, itemAmount: Number(e.target.value) })
              }
              style={{ flex: 1, padding: "8px", marginRight: "10px" }}
            />
            <input
              type='number'
              placeholder='Price'
              value={item.itemPrice}
              onChange={(e) =>
                setItem({ ...item, itemPrice: Number(e.target.value) })
              }
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
              Add Item
            </button>
          </div>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Total Amount: ₪{invoiceData.totalAmount.toFixed(2)}</label>
        </div>
        <button
          type='submit'
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          Generate PDF
        </button>
      </form>
    </div>
  );
};

export default InvoiceForm;
