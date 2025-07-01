import RegisterForm from "@/components/forms/RegistrationForm";


const RegisterPage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
      <div className="max-w-sm w-full bg-white shadow p-6 rounded">
        <h1 className="text-xl font-bold mb-4 text-center">Register</h1>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
