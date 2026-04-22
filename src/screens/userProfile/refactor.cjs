const fs = require('fs');
let code = fs.readFileSync('index.temp.tsx', 'utf-8');

code = code.replace(
  'import { useState, useEffect, type ChangeEvent } from "react";\r\nimport api from "../../services/axios";',
  'import { useState, useEffect, type ChangeEvent } from "react";\r\nimport { useForm, type SubmitHandler } from "react-hook-form";\r\nimport api from "../../services/axios";'
);

code = code.replace(
  'const [formData, setFormData] = useState<ProfileFormData>({\r\n    firstName: "",\r\n    middleInitial: "",\r\n    lastName: "",\r\n    dob: "",\r\n    gender: "",\r\n    email: "",\r\n    phoneNumber: "",\r\n    role: "",\r\n    country: "",\r\n    state: "",\r\n    zipCode: "",\r\n    profileImage: "",\r\n    orgName: "",\r\n    orgLogo: "",\r\n    department: "",\r\n  });',
  `const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: "",
      middleInitial: "",
      lastName: "",
      dob: "",
      gender: "",
      email: "",
      phoneNumber: "",
      role: "",
      country: "",
      state: "",
      zipCode: "",
      profileImage: "",
      orgName: "",
      orgLogo: "",
      department: "",
    },
  });

  const formData = watch();`
);

code = code.replace(
  `      setFormData({
        firstName: data.firstName || "",
        middleInitial: data.middleInitial || "",
        lastName: data.lastName || "",
        dob: formattedDob,
        gender: data.gender || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        role: data.role || "",
        country: data.country || "",
        state: data.state || "",
        zipCode: data.zipCode || "",
        profileImage: data.profileImage || "",
        orgName: data.orgName || "",
        orgLogo: data.orgLogo || "",
        department: data.department || "",
      });`.replace(/\n/g, '\r\n'),
  `      reset({
        firstName: data.firstName || "",
        middleInitial: data.middleInitial || "",
        lastName: data.lastName || "",
        dob: formattedDob,
        gender: data.gender || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        role: data.role || "",
        country: data.country || "",
        state: data.state || "",
        zipCode: data.zipCode || "",
        profileImage: data.profileImage || "",
        orgName: data.orgName || "",
        orgLogo: data.orgLogo || "",
        department: data.department || "",
      });`.replace(/\n/g, '\r\n')
);

code = code.replace(
  `  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    // Map IDs to state keys
    const fieldMapping: { [key: string]: string } = {
      fname: "firstName",
      mname: "middleInitial",
      lname: "lastName",
      dob: "dob",
      gender: "gender",
      email: "email",
      phno: "phoneNumber",
      userRole: "role",
      country: "country",
      city: "state", // Mapping 'city' ID to 'state' field as requested
      zipCode: "zipCode",
    };

    const fieldName = fieldMapping[id] || id;

    if (fieldName === "phoneNumber") {
    const phoneRegex = /^[0-9+\\-()\\s]*$/;

    if (!phoneRegex.test(value)) {
      toast.error("Phone number can only contain numbers and special characters (+ - ( ) )");
      return;
    }
  }

    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };`.replace(/\n/g, '\r\n'),
  ``
);

code = code.replace(
  `  const handleSave = async () => {
    setSaving(true);

    if (!/^[0-9+\\-()\\s]+$/.test(formData.phoneNumber)) {
    toast.error("Invalid phone number format");
    setSaving(false);
    return;
  }`.replace(/\n/g, '\r\n'),
  `  const onSubmit: SubmitHandler<ProfileFormData> = async (dataForm) => {
    setSaving(true);`.replace(/\n/g, '\r\n')
);

code = code.replace(
  `      data.append("firstName", formData.firstName);
      data.append("middleInitial", formData.middleInitial);
      data.append("lastName", formData.lastName);
      data.append("dob", formData.dob);
      data.append("gender", formData.gender);
      data.append("phoneNumber", formData.phoneNumber);
      data.append("country", formData.country);
      data.append("state", formData.state);
      data.append("zipCode", formData.zipCode);
      data.append("department", formData.department);`.replace(/\n/g, '\r\n'),
  `      data.append("firstName", dataForm.firstName);
      data.append("middleInitial", dataForm.middleInitial);
      data.append("lastName", dataForm.lastName);
      data.append("dob", dataForm.dob);
      data.append("gender", dataForm.gender);
      data.append("phoneNumber", dataForm.phoneNumber);
      data.append("country", dataForm.country);
      data.append("state", dataForm.state);
      data.append("zipCode", dataForm.zipCode);
      data.append("department", dataForm.department);`.replace(/\n/g, '\r\n')
);

code = code.replace(
  `  const isFormValid =
    formData.firstName.trim() !== "" &&
    formData.lastName.trim() !== "" &&
    formData.dob.trim() !== "" &&
    formData.phoneNumber.trim() !== "" &&
    formData.country.trim() !== "" &&
    formData.state.trim() !== "" &&
    formData.zipCode.trim() !== "";

  return (
    <>
      <div className="user-profile-screen bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-162px)]">`.replace(/\n/g, '\r\n'),
  `  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="user-profile-screen bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-162px)]">`.replace(/\n/g, '\r\n')
);

code = code.replace(
  `          <button
            type="button"
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
            disabled={saving || (isEditing && !isFormValid)}`.replace(/\n/g, '\r\n'),
  `          <button
            type={isEditing ? "submit" : "button"}
            onClick={(e) => {
              if (!isEditing) {
                e.preventDefault();
                setIsEditing(true);
              }
            }}
            disabled={saving}`.replace(/\n/g, '\r\n')
);

code = code.replace(
  `              <input
                type="text"
                id="fname"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] border-[#E8E8E8] focus:border-[var(--primary-color)] disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Enter your first name"
                required
              />`.replace(/\n/g, '\r\n'),
  `              <input
                type="text"
                id="fname"
                disabled={!isEditing}
                className={\`font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] \${errors.firstName ? 'border-red-500' : 'border-[#E8E8E8] focus:border-[var(--primary-color)]'} disabled:bg-gray-50 disabled:cursor-not-allowed\`}
                placeholder="Enter your first name"
                {...register("firstName", { required: "First name is required" })}
              />
              {errors.firstName && (<span className="text-red-500 text-xs mt-1 block">{errors.firstName.message}</span>)}`.replace(/\n/g, '\r\n')
);

code = code.replace(
  `              <input
                type="text"
                id="mname"
                value={formData.middleInitial}
                onChange={handleChange}
                disabled={!isEditing}
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] border-[#E8E8E8] focus:border-[var(--primary-color)] disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Enter your middle initial"
              />`.replace(/\n/g, '\r\n'),
  `              <input
                type="text"
                id="mname"
                disabled={!isEditing}
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] border-[#E8E8E8] focus:border-[var(--primary-color)] disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Enter your middle initial"
                {...register("middleInitial")}
              />`.replace(/\n/g, '\r\n')
);

code = code.replace(
  `              <input
                type="text"
                id="lname"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] border-[#E8E8E8] focus:border-[var(--primary-color)] disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Enter your last name"
                required
              />`.replace(/\n/g, '\r\n'),
  `              <input
                type="text"
                id="lname"
                disabled={!isEditing}
                className={\`font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] \${errors.lastName ? 'border-red-500' : 'border-[#E8E8E8] focus:border-[var(--primary-color)]'} disabled:bg-gray-50 disabled:cursor-not-allowed\`}
                placeholder="Enter your last name"
                {...register("lastName", { required: "Last name is required" })}
              />
              {errors.lastName && (<span className="text-red-500 text-xs mt-1 block">{errors.lastName.message}</span>)}`.replace(/\n/g, '\r\n')
);

code = code.replace(
  `              <input
                type="date"
                id="dob"
                value={formData.dob}
                onChange={handleChange}
                disabled={!isEditing}
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] border-[#E8E8E8] focus:border-[var(--primary-color)] disabled:bg-gray-50 disabled:cursor-not-allowed"
                required
              />`.replace(/\n/g, '\r\n'),
  `              <input
                type="date"
                id="dob"
                disabled={!isEditing}
                className={\`font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] \${errors.dob ? 'border-red-500' : 'border-[#E8E8E8] focus:border-[var(--primary-color)]'} disabled:bg-gray-50 disabled:cursor-not-allowed\`}
                {...register("dob", { required: "Date of birth is required" })}
              />
              {errors.dob && (<span className="text-red-500 text-xs mt-1 block">{errors.dob.message}</span>)}`.replace(/\n/g, '\r\n')
);

code = code.replace(
  `                <select
                  id="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="font-medium text-sm text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg appearance-none transition-all border-[#E8E8E8] focus:border-[var(--primary-color)] disabled:bg-gray-50 disabled:cursor-not-allowed"
                >`.replace(/\n/g, '\r\n'),
  `                <select
                  id="gender"
                  disabled={!isEditing}
                  className="font-medium text-sm text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-3 mt-2 border rounded-lg appearance-none transition-all border-[#E8E8E8] focus:border-[var(--primary-color)] disabled:bg-gray-50 disabled:cursor-not-allowed"
                  {...register("gender")}
                >`.replace(/\n/g, '\r\n')
);

code = code.replace(
  `              <input
                type="email"
                id="email"
                value={formData.email}
                readOnly
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none border-[#E8E8E8] bg-neutral-100 cursor-not-allowed read-only:bg-gray-50"
                placeholder="Enter your email"
              />`.replace(/\n/g, '\r\n'),
  `              <input
                type="email"
                id="email"
                readOnly
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none border-[#E8E8E8] bg-neutral-100 cursor-not-allowed read-only:bg-gray-50"
                placeholder="Enter your email"
                {...register("email")}
              />`.replace(/\n/g, '\r\n')
);

code = code.replace(
  `              <input
                type="text"
                id="phno"
                value={formData.phoneNumber}
                onChange={handleChange}
                onKeyPress={(e) => {
                  const allowed = /[0-9+\\-()\\s]/;
                  if (!allowed.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                disabled={!isEditing}
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] border-[#E8E8E8] focus:border-[var(--primary-color)] disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Enter your phone number"
                required
              />`.replace(/\n/g, '\r\n'),
  `              <input
                type="text"
                id="phno"
                onKeyPress={(e) => {
                  const allowed = /[0-9+\\-()\\s]/;
                  if (!allowed.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                disabled={!isEditing}
                className={\`font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] \${errors.phoneNumber ? 'border-red-500' : 'border-[#E8E8E8] focus:border-[var(--primary-color)]'} disabled:bg-gray-50 disabled:cursor-not-allowed\`}
                placeholder="Enter your phone number"
                {...register("phoneNumber", { required: "Phone number is required", pattern: { value: /^[0-9+\\-()\\s]+$/, message: "Invalid format" } })}
              />
              {errors.phoneNumber && (<span className="text-red-500 text-xs mt-1 block">{errors.phoneNumber.message}</span>)}`.replace(/\n/g, '\r\n')
);

code = code.replace(
  `              <input
                type="text"
                id="userRole"
                value={formData.role}
                readOnly
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none border-[#E8E8E8] bg-neutral-100 cursor-not-allowed capitalize read-only:bg-gray-50"
                placeholder="User role"
              />`.replace(/\n/g, '\r\n'),
  `              <input
                type="text"
                id="userRole"
                readOnly
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none border-[#E8E8E8] bg-neutral-100 cursor-not-allowed capitalize read-only:bg-gray-50"
                placeholder="User role"
                {...register("role")}
              />`.replace(/\n/g, '\r\n')
);

code = code.replace(
  `                <input
                  type="text"
                  id="orgName"
                  value={formData.orgName}
                  readOnly
                  className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none border-[#E8E8E8] bg-neutral-100 cursor-not-allowed"
                  placeholder="Organization name"
                />`.replace(/\n/g, '\r\n'),
  `                <input
                  type="text"
                  id="orgName"
                  readOnly
                  className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none border-[#E8E8E8] bg-neutral-100 cursor-not-allowed"
                  placeholder="Organization name"
                  {...register("orgName")}
                />`.replace(/\n/g, '\r\n')
);

code = code.replace(
  `                <input
                  type="text"
                  id="department"
                  value={formData.department}
                  onChange={handleChange}
                  disabled={
                    !isEditing ||`.replace(/\n/g, '\r\n'),
  `                <input
                  type="text"
                  id="department"
                  {...register("department")}
                  disabled={
                    !isEditing ||`.replace(/\n/g, '\r\n')
);

code = code.replace(
  `              <input
                type="text"
                id="country"
                value={formData.country}
                onChange={handleChange}
                disabled={!isEditing}
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] border-[#E8E8E8] focus:border-[var(--primary-color)] disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Enter your country"
                required
              />`.replace(/\n/g, '\r\n'),
  `              <input
                type="text"
                id="country"
                disabled={!isEditing}
                className={\`font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] \${errors.country ? 'border-red-500' : 'border-[#E8E8E8] focus:border-[var(--primary-color)]'} disabled:bg-gray-50 disabled:cursor-not-allowed\`}
                placeholder="Enter your country"
                {...register("country", { required: "Country is required" })}
              />
              {errors.country && (<span className="text-red-500 text-xs mt-1 block">{errors.country.message}</span>)}`.replace(/\n/g, '\r\n')
);

code = code.replace(
  `              <input
                type="text"
                id="city"
                value={formData.state}
                onChange={handleChange}
                disabled={!isEditing}
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] border-[#E8E8E8] focus:border-[var(--primary-color)] disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Enter your state"
                required
              />`.replace(/\n/g, '\r\n'),
  `              <input
                type="text"
                id="city"
                disabled={!isEditing}
                className={\`font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] \${errors.state ? 'border-red-500' : 'border-[#E8E8E8] focus:border-[var(--primary-color)]'} disabled:bg-gray-50 disabled:cursor-not-allowed\`}
                placeholder="Enter your state"
                {...register("state", { required: "State is required" })}
              />
              {errors.state && (<span className="text-red-500 text-xs mt-1 block">{errors.state.message}</span>)}`.replace(/\n/g, '\r\n')
);

code = code.replace(
  `              <input
                type="text"
                id="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                disabled={!isEditing}
                className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] border-[#E8E8E8] focus:border-[var(--primary-color)] disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Enter your zip code"
                required
              />`.replace(/\n/g, '\r\n'),
  `              <input
                type="text"
                id="zipCode"
                disabled={!isEditing}
                className={\`font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg transition-all outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] \${errors.zipCode ? 'border-red-500' : 'border-[#E8E8E8] focus:border-[var(--primary-color)]'} disabled:bg-gray-50 disabled:cursor-not-allowed\`}
                placeholder="Enter your zip code"
                {...register("zipCode", { required: "Zip code is required" })}
              />
              {errors.zipCode && (<span className="text-red-500 text-xs mt-1 block">{errors.zipCode.message}</span>)}`.replace(/\n/g, '\r\n')
);

code = code.replace(
  `        </div>
      </div>

      {showLogoModal && (`.replace(/\n/g, '\r\n'),
  `        </div>
      </form>

      {showLogoModal && (`.replace(/\n/g, '\r\n')
);

fs.writeFileSync('index.tsx', code);
console.log('Done refactoring');
