import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import generateHMAC from "../utils/Hmac.js";
import { env } from "../utils/config.js";
import "./DeleteUser.css";

const DeleteUser = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [lastHash, setLastHash] = useState("");

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const normalizedPhone = useMemo(() => phoneNumber.replace(/\D/g, ""), [phoneNumber]);
  const dataToSign = useMemo(() => `+91${normalizedPhone}`, [normalizedPhone]);

  const handleDelete = async () => {
    if (!normalizedPhone) {
      setMessage("Please enter phone number");
      return;
    }
    if (normalizedPhone.length !== 10) {
      setMessage("Phone number should be 10 digits");
      return;
    }

    setLoading(true);
    try {
      const phoneNumberHash = await generateHMAC(dataToSign);
      setLastHash(phoneNumberHash);

      const res = await axios.post(
        `${env.BASE_URL}/admin/delete-user`,
        { phoneNumberHash },
        { withCredentials: true }
      );

      setMessage(res?.data?.message || "User deleted");
      setPhoneNumber("");
      // Keep inputs (so admin can retry), but you can uncomment if you want reset:
      // setPhoneNumber("");
      // setDate("");
    } catch (err) {
      const apiMsg = err?.response?.data?.message;
      setMessage(apiMsg || "Failed to delete user");
      // eslint-disable-next-line no-console
      console.error("delete-user error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="delete-user-page">
      <Header />

      {message && <div className="toast">{message}</div>}

      <div className="delete-user-card">
        <h2 className="page-title">Delete User</h2>
        <p className="helper">
          Input phone. We compute <code>{`HMAC_SHA256("+91" + phone)`}</code> and
          send it as <code>phoneNumberHash</code>.
        </p>

        <div className="form">
          <label className="field">
            <span>Phone Number</span>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="10 digit number (without +91)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              maxLength={16}
            />
          </label>
        </div>

        <div className="actions">
          <button className="danger-btn" disabled={loading} onClick={handleDelete}>
            {loading ? "Deleting..." : "Delete User"}
          </button>
        </div>

        {lastHash ? (
          <div className="hash-preview">
            <div className="hash-title">Last Generated phoneNumberHash</div>
            <div className="hash">{lastHash}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DeleteUser;


