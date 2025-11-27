"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Loader from "../../../../components/loader";
import { AppAlert } from "../../../../components/alerts";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { IconDeviceFloppy, IconKey } from "@tabler/icons-react";

type UserProfile = {
  name: string;
  email: string;
  phone: string | null;
  institution: string | null;
  image: string;
};

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    institution: "",
    image: "/images/users/user_default.png",
  });
  
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [alert, setAlert] = useState({
    show: false,
    type: "info" as "success" | "error" | "warning" | "info",
    title: "",
    description: "",
  });

  // 1. Fetch user data on load
  useEffect(() => {
    if (status === "authenticated") {
      const fetchUser = async () => {
        setLoading(true);
        try {
          const res = await fetch("/api/users/fetch-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: session?.user?.id }),
          });
          const data = await res.json();
          if (data.user_info?.[0]) {
            setProfile(data.user_info[0]);
          }
        } catch {
          // FIX: Removed unused 'err' variable
          setAlert({
            show: true,
            type: "error",
            title: "Error",
            description: "Could not load your profile data.",
          });
        }
        setLoading(false);
      };
      fetchUser();
    }
  }, [status, session]);

  // 2. Handle profile info updates
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);

    try {
      const res = await fetch("/api/users/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          institution: profile.institution,
          user_id: session?.user?.id,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setAlert({
        show: true,
        type: "success",
        title: "Success",
        description: "Your profile has been updated.",
      });
    } catch (err) {
      // FIX: Handle unknown error type safely instead of using 'any'
      const errorMessage = err instanceof Error ? err.message : "Could not save profile.";
      setAlert({
        show: true,
        type: "error",
        title: "Update Failed",
        description: errorMessage,
      });
    }
    setIsSavingProfile(false);
  };

  // 3. Handle password change
  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setAlert({
        show: true,
        type: "error",
        title: "Passwords do not match",
        description: "Please re-enter your new password.",
      });
      return;
    }
    
    setIsSavingPassword(true);

    try {
      const res = await fetch("/api/users/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
          user_id: session?.user?.id,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setAlert({
        show: true,
        type: "success",
        title: "Success",
        description: "Your password has been changed.",
      });
      // Clear password fields
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      // FIX: Handle unknown error type safely instead of using 'any'
      const errorMessage = err instanceof Error ? err.message : "Could not change password.";
      setAlert({
        show: true,
        type: "error",
        title: "Update Failed",
        description: errorMessage,
      });
    }
    setIsSavingPassword(false);
  };

  // Handle text input changes
  const onProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  
  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader isLoading={true} className=""/>
      </div>
    );
  }

  return (
    <>
      <AppAlert
        {...alert}
        open={alert.show}
        onClose={() => setAlert({ ...alert, show: false })}
      />
      <div className="max-w-4xl mx-auto p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column (Avatar) */}
          <div className="md:col-span-1 flex flex-col items-center">
            {/* FIX: Suppress Next.js image warning */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.image || "/images/users/user_default.png"}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border-4 border-gray-200 dark:border-neutral-700 shadow-md"
              onError={(e) => (e.currentTarget.src = "/images/users/user_default.png")}
            />
            <Button variant="outline" className="mt-4 text-sm" disabled>
              Change Picture
            </Button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {/* TODO: Add image upload logic here. */}
              Image upload is not yet enabled.
            </p>
          </div>

          {/* Right Column (Forms) */}
          <div className="md:col-span-2 space-y-10">
            {/* Profile Details Form */}
            <form
              onSubmit={handleProfileSave}
              className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm border dark:border-neutral-800"
            >
              <h2 className="text-xl font-semibold mb-5">Profile Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <Input
                    name="name"
                    value={profile.name}
                    onChange={onProfileChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <Input
                    name="email"
                    value={profile.email}
                    disabled
                    className="mt-1 bg-gray-100 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                  <Input
                    name="phone"
                    value={profile.phone || ""}
                    onChange={onProfileChange}
                    placeholder="Your phone number"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Institution</label>
                  <Input
                    name="institution"
                    value={profile.institution || ""}
                    onChange={onProfileChange}
                    placeholder="Your school or college"
                    className="mt-1"
                  />
                </div>
              </div>
              <Button type="submit" className="mt-6 w-full md:w-auto" disabled={isSavingProfile}>
                {isSavingProfile ? <Loader isLoading={true} className=""/> : <IconDeviceFloppy className="w-4 h-4 mr-2" />}
                Save Changes
              </Button>
            </form>

            {/* Password Change Form */}
            <form
              onSubmit={handlePasswordSave}
              className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-sm border dark:border-neutral-800"
            >
              <h2 className="text-xl font-semibold mb-5">Change Password</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                  <Input
                    name="oldPassword"
                    type="password"
                    value={passwords.oldPassword}
                    onChange={onPasswordChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                  <Input
                    name="newPassword"
                    type="password"
                    value={passwords.newPassword}
                    onChange={onPasswordChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                  <Input
                    name="confirmPassword"
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={onPasswordChange}
                    className="mt-1"
                  />
                </div>
              </div>
              <Button type="submit" className="mt-6 w-full md:w-auto" disabled={isSavingPassword}>
                {isSavingPassword ? <Loader isLoading={true} className="" /> : <IconKey className="w-4 h-4 mr-2" />}
                Change Password
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}