import { useNavigate } from "react-router-dom";
import TransactionForm from "../components/TransactionForm";
import { createTransaction } from "../utils/api";

function AddTransaction() {
  const navigate = useNavigate();

  const handleAdd = async (formData) => {
    await createTransaction(formData);
    navigate("/"); // go back to dashboard after adding
  };

  return (
    <div className="page centered">
      <TransactionForm onAdd={handleAdd} />
    </div>
  );
}

export default AddTransaction;
