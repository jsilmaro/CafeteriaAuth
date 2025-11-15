import { useState } from "react";
import SharedSidebar from "@/components/shared-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Trash2, Clock, Users, Bell } from "lucide-react";

// --- Utility Function to Calculate Hours ---
const calculateDuration = (openTime, closeTime, isClosed) => {
  if (isClosed) return "Closed";
  try {
    const [openHour, openMinute] = openTime.split(":").map(Number);
    const [closeHour, closeMinute] = closeTime.split(":").map(Number);

    let start = openHour * 60 + openMinute;
    let end = closeHour * 60 + closeMinute;

    if (end < start) end += 24 * 60; // Overnight case
    const totalMinutes = end - start;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (totalMinutes < 0) return "Invalid Time";
    if (totalMinutes === 0 && start !== end) return "24 Hours (Overnight)";
    if (totalMinutes === 0) return "Closed";

    let durationString = `${hours} hr${hours !== 1 ? "s" : ""}`;
    if (minutes > 0) {
      durationString += ` ${minutes} min${minutes !== 1 ? "s" : ""}`;
    }
    return durationString;
  } catch {
    return "Set Times";
  }
};

// --- Operating Hour Row ---
function HourInputRow({ day, times, handleHourChange }) {
  const isClosed = times.status === "Closed";
  const duration = calculateDuration(times.open, times.close, isClosed);

  let badgeClass = "bg-gray-100 text-gray-700";
  if (duration === "Closed") badgeClass = "bg-red-100 text-red-700";
  else if (duration === "Invalid Time") badgeClass = "bg-yellow-100 text-yellow-700";
  else if (duration !== "Set Times") badgeClass = "bg-[#E6F4D2] text-[#6A972E] font-bold";

  return (
    // Responsive grid layout: stacks on mobile, grid on larger screens
    <div className="flex flex-col sm:grid sm:grid-cols-[1fr,1.5fr,1.5fr,1fr] items-start sm:items-center gap-3 sm:gap-4 py-4 sm:py-3 border-b last:border-b-0 px-3 sm:px-4 lg:px-6">
      {/* Day + Closed Switch */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-2">
        <span className="font-semibold text-gray-800 text-sm sm:text-base">{day}</span>
        <Switch
          checked={!isClosed}
          onCheckedChange={(checked) =>
            handleHourChange(day, "status", checked ? "Open" : "Closed")
          }
          className="data-[state=checked]:bg-[#6A972E] data-[state=unchecked]:bg-red-500"
        />
      </div>

      {/* Time inputs - side by side on mobile */}
      <div className="flex gap-2 w-full sm:contents">
        {/* Open Time */}
        <Input
          type="time"
          value={times.open}
          onChange={(e) => handleHourChange(day, "open", e.target.value)}
          className="w-full text-sm"
          disabled={isClosed}
        />

        {/* Close Time */}
        <Input
          type="time"
          value={times.close}
          onChange={(e) => handleHourChange(day, "close", e.target.value)}
          className="w-full text-sm"
          disabled={isClosed}
        />
      </div>

      {/* Duration */}
      <div className={`px-2 sm:px-3 py-1 text-xs sm:text-sm text-center rounded-full w-full sm:w-auto ${badgeClass}`}>
        {duration}
      </div>
    </div>
  );
}

// ... (The rest of your SettingsPage component remains the same)
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("hours");

  const [hours, setHours] = useState({
    Monday: { open: "08:00", close: "17:00", status: "Open" },
    Tuesday: { open: "08:00", close: "17:00", status: "Open" },
    Wednesday: { open: "08:00", close: "17:00", status: "Open" },
    Thursday: { open: "08:00", close: "17:00", status: "Open" },
    Friday: { open: "08:00", close: "22:00", status: "Open" },
    Saturday: { open: "10:00", close: "14:30", status: "Open" },
    Sunday: { open: "00:00", close: "00:00", status: "Closed" },
  });

  const [staff, setStaff] = useState([
    { id: 1, name: "Anna Ciriaco", role: "Cashier", email: "anna.c@gmail.com", status: "Active" },
    { id: 2, name: "Jennifer Carlos", role: "Cook", email: "jennifer.c@gmail.com", status: "Active" },
    { id: 3, name: "Joshua Smith", role: "Deliverer", email: "joshua.s@gmail.com", status: "Active" },
  ]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: "", role: "", email: "", status: "Active" });

  const [notifications, setNotifications] = useState({
    newOrders: true,
    lowStockAlerts: true,
    dailyReports: true,
    systemMaintenance: false,
  });

  const handleHourChange = (day, type, value) => {
    setHours((prev) => ({ ...prev, [day]: { ...prev[day], [type]: value } }));
  };

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.role || !newStaff.email) return;
    setStaff((prev) => [
      ...prev,
      { ...newStaff, id: prev.length ? prev[prev.length - 1].id + 1 : 1 },
    ]);
    setNewStaff({ name: "", role: "", email: "", status: "Active" });
    setIsAddModalOpen(false);
  };

  const handleRemoveStaff = (id) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSaveChanges = () => {
     
    window.alert("Settings saved successfully!");
  };

  const tabs = [
    { id: "hours", label: "Operating Hours", icon: Clock },
    // { id: "staff", label: "Staff", icon: Users },
    { id: "notifications", label: "Notification", icon: Bell },
  ];

  return (
    <SharedSidebar>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b px-4 sm:px-6 py-3 sm:py-4">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Settings</h1>
          <p className="text-xs sm:text-sm text-gray-500">Welcome back, Staff Name</p>
        </div>

        <div className="p-4 sm:p-6">
          <div className="bg-white rounded-lg shadow-xl">
            <div className="border-b px-3 sm:px-6 flex gap-3 sm:gap-6 overflow-x-auto">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 py-3 sm:py-4 px-2 border-b-2 font-medium whitespace-nowrap text-sm sm:text-base ${
                    activeTab === id
                      ? "border-[#6A972E] text-[#6A972E]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" /> {label}
                </button>
              ))}
            </div>

            <div className="p-4 sm:p-6">
              {activeTab === "hours" && (
                <div>
                  <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4">Store Operating Hours</h2>
                  <div className="border rounded-lg divide-y divide-gray-200 overflow-hidden">
                    {Object.entries(hours).map(([day, times]) => (
                      <HourInputRow
                        key={day}
                        day={day}
                        times={times}
                        handleHourChange={handleHourChange}
                      />
                    ))}
                  </div>
                </div>
              )}
{/*
              {activeTab === "staff" && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                    <h2 className="text-base sm:text-lg lg:text-xl font-semibold">Staff Management</h2>
                    <Button onClick={() => setIsAddModalOpen(true)} className="bg-[#6A972E] text-white text-sm sm:text-base w-full sm:w-auto">
                      + Add Staff
                    </Button>
                  </div>

                  <div className="overflow-x-auto border rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium whitespace-nowrap">Name</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium whitespace-nowrap">Role</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium whitespace-nowrap">Email</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium whitespace-nowrap">Status</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium whitespace-nowrap">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {staff.map((s) => (
                          <tr key={s.id}>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm whitespace-nowrap">{s.name}</td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm whitespace-nowrap">{s.role}</td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm whitespace-nowrap">{s.email}</td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4">
                              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                {s.status}
                              </span>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleRemoveStaff(s.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {isAddModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
                      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-md mx-4">
                        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Add New Staff</h3>
                        <div className="space-y-3">
                          <Input
                            placeholder="Name"
                            value={newStaff.name}
                            onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                            className="text-sm"
                          />
                          <Input
                            placeholder="Role"
                            value={newStaff.role}
                            onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                            className="text-sm"
                          />
                          <Input
                            placeholder="Email"
                            type="email"
                            value={newStaff.email}
                            onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                            className="text-sm"
                          />
                          <select
                            value={newStaff.status}
                            onChange={(e) => setNewStaff({ ...newStaff, status: e.target.value })}
                            className="border rounded p-2 w-full text-sm"
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
                          <Button variant="ghost" onClick={() => setIsAddModalOpen(false)} className="w-full sm:w-auto text-sm">
                            Cancel
                          </Button>
                          <Button className="bg-[#6A972E] hover:bg-green-700 text-white w-full sm:w-auto text-sm" onClick={handleAddStaff}>
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
*/}
              {activeTab === "notifications" && (
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-base sm:text-lg lg:text-xl font-semibold">Notification Settings</h2>
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-3 sm:py-2 border-b">
                      <span className="capitalize text-sm sm:text-base">{key.replace(/([A-Z])/g, " $1")}</span>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, [key]: checked }))}
                        className="data-[state=checked]:bg-[#6A972E]"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 sm:mt-8 pt-4 border-t flex justify-end">
                <Button onClick={handleSaveChanges} className="bg-[#6A972E] text-white px-6 sm:px-8 py-2 sm:py-2.5 text-sm sm:text-base w-full sm:w-auto">
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SharedSidebar>
  );
}