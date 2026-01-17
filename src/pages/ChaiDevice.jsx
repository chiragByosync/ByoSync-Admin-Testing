import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { env } from "../utils/config.js";
import "./ChaiDevice.css";

const ChaiDevice = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toDisplay = (value) => {
    if (value === null || value === undefined || value === "") return "-";
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (typeof value === "boolean") return value ? "true" : "false";
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  };

  const toPrettyJson = (value) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value;
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  };

  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `${env.BASE_URL}/admin/get-all-chai-devices`,
          { withCredentials: true }
        );
        console.log("res", res);
        // Normalize possible response shapes
        const raw = res?.data?.data ?? res?.data ?? {};
        console.log("raw", raw);
        const list =
          raw?.devices ??
          raw?.chaiDevices ??
          raw?.data?.devices ??
          raw?.data ??
          raw;
        console.log("list", list);
        setDevices(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error("Error fetching chai devices:", e);
        setError(e?.response?.data?.message || "Failed to fetch chai devices.");
        setDevices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const rows = useMemo(() => {
    return (devices ?? []).map((d) => {
      let parsed = null;
      try {
        if (!d?.deviceData) parsed = null;
        else if (typeof d.deviceData === "string") parsed = JSON.parse(d.deviceData);
        else if (typeof d.deviceData === "object") parsed = d.deviceData;
        else parsed = null;
      } catch {
        parsed = null;
      }

      const androidVersion =
        parsed?.androidVersion ?? parsed?.sdkInt ?? parsed?.version ?? null;

      return {
        id: d?._id ?? d?.id,
        deviceName: toDisplay(d?.deviceName),
        deviceKey: toDisplay(d?.deviceKey),
        brand: toDisplay(parsed?.brand ?? parsed?.manufacturer),
        model: toDisplay(parsed?.model),
        androidVersion: toDisplay(androidVersion),
        createdAt: d?.createdAt ? new Date(d.createdAt).toLocaleString() : "-",
        updatedAt: d?.updatedAt ? new Date(d.updatedAt).toLocaleString() : "-",
        rawDeviceData: toPrettyJson(d?.deviceData),
      };
    });
  }, [devices]);

  return (
    <>
      <Header />
      <div className="chai-device-page">
        <div className="chai-device-header">
          <div>
            <h2 className="chai-device-title">Chai Devices</h2>
            <p className="chai-device-subtitle">
              Total: {rows.length}
              {loading ? " (loading…)" : ""}
            </p>
          </div>
        </div>

        {error ? <div className="chai-device-error">{error}</div> : null}

        {loading && rows.length === 0 ? (
          <div className="chai-device-loading">Loading devices…</div>
        ) : rows.length === 0 ? (
          <div className="chai-device-empty">No devices found.</div>
        ) : (
          <div className="chai-device-tablewrap">
            <table className="chai-device-table">
              <thead>
                <tr>
                  <th>Device Name</th>
                  <th>Device Key</th>
                  <th>Brand</th>
                  <th>Model</th>
                  <th>Android</th>
                  <th>Created</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.deviceName}</td>
                    <td className="chai-device-mono" title={r.deviceKey}>
                      {String(r.deviceKey).length > 18
                        ? `${String(r.deviceKey).slice(0, 10)}…${String(
                            r.deviceKey
                          ).slice(-6)}`
                        : r.deviceKey}
                      {r.rawDeviceData ? (
                        <details className="chai-device-details">
                          <summary>Data</summary>
                          <pre className="chai-device-pre">
                            {r.rawDeviceData}
                          </pre>
                        </details>
                      ) : null}
                    </td>
                    <td>{r.brand}</td>
                    <td>{r.model}</td>
                    <td>{r.androidVersion}</td>
                    <td>{r.createdAt}</td>
                    <td>{r.updatedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default ChaiDevice;
