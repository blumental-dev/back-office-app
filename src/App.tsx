import React, { useState } from "react";
import axios from "axios";

interface InvoiceItem {
  name: string;
  price: number;
}

interface Invoice {
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  clientPhone: string;
  invoiceNumber: string;
  date: string;
  items: InvoiceItem[];
  totalAmount: number;
  paymentDetails: string;
}

const App: React.FC = () => {
  const [invoice, setInvoice] = useState<Invoice>({
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    clientPhone: "",
    invoiceNumber: "",
    date: "",
    items: [],
    totalAmount: 0,
    paymentDetails: "",
  });

  const [item, setItem] = useState<InvoiceItem>({ name: "", price: 0 });

  const handleAddItem = () => {
    setInvoice((prevState) => ({
      ...prevState,
      items: [...prevState.items, item],
    }));
    setItem({ name: "", price: 0 });
  };

  const generatePDF = async () => {
    try {
      const response = await axios.post(
        "http://localhost:6543/generate-pdf",
        invoice,
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
      <form>
        <div style={{ marginBottom: "10px" }}>
          <label>Client Name:</label>
          <input
            type='text'
            placeholder='Client Name'
            value={invoice.clientName}
            onChange={(e) =>
              setInvoice({ ...invoice, clientName: e.target.value })
            }
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Client Email:</label>
          <input
            type='email'
            placeholder='Client Email'
            value={invoice.clientEmail}
            onChange={(e) =>
              setInvoice({ ...invoice, clientEmail: e.target.value })
            }
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Client Address:</label>
          <input
            type='text'
            placeholder='Client Address'
            value={invoice.clientAddress}
            onChange={(e) =>
              setInvoice({ ...invoice, clientAddress: e.target.value })
            }
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Client Phone:</label>
          <input
            type='text'
            placeholder='Client Phone'
            value={invoice.clientPhone}
            onChange={(e) =>
              setInvoice({ ...invoice, clientPhone: e.target.value })
            }
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Invoice Number:</label>
          <input
            type='text'
            placeholder='Invoice Number'
            value={invoice.invoiceNumber}
            onChange={(e) =>
              setInvoice({ ...invoice, invoiceNumber: e.target.value })
            }
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Date:</label>
          <input
            type='date'
            value={invoice.date}
            onChange={(e) => setInvoice({ ...invoice, date: e.target.value })}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Items:</label>
          {invoice.items.map((item, index) => (
            <div
              key={index}
              style={{
                padding: "8px",
                marginBottom: "5px",
                border: "1px solid #ccc",
              }}
            >
              {item.name} - ${item.price}
            </div>
          ))}
          <div style={{ display: "flex", marginTop: "10px" }}>
            <input
              type='text'
              placeholder='Item Name'
              value={item.name}
              onChange={(e) => setItem({ ...item, name: e.target.value })}
              style={{ flex: 2, padding: "8px", marginRight: "10px" }}
            />
            <input
              type='number'
              placeholder='Item Price'
              value={item.price}
              onChange={(e) =>
                setItem({ ...item, price: Number(e.target.value) })
              }
              style={{ flex: 1, padding: "8px" }}
            />
            <button
              type='button'
              onClick={handleAddItem}
              style={{ marginLeft: "10px" }}
            >
              Add Item
            </button>
          </div>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Total Amount:</label>
          <input
            type='number'
            placeholder='Total Amount'
            value={invoice.totalAmount}
            onChange={(e) =>
              setInvoice({ ...invoice, totalAmount: Number(e.target.value) })
            }
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Payment Details:</label>
          <textarea
            placeholder='Payment Details'
            value={invoice.paymentDetails}
            onChange={(e) =>
              setInvoice({ ...invoice, paymentDetails: e.target.value })
            }
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>
        <button
          type='button'
          onClick={generatePDF}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          Generate PDF
        </button>
      </form>
    </div>
  );
};

export default App;
