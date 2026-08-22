import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getBudgetExpenses,
    getBudgetSummary,
    createBudgetExpense,
    deleteBudgetExpense,
} from "../services/api";

function Budget() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [expenses, setExpenses] = useState([]);
    const [summary, setSummary] = useState({
        total: 0,
        breakdown: {},
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        title: "",
        description: "",
        amount: "",
        category: "Other",
    });

    async function loadBudget() {
        try {
            const [expenseData, summaryData] = await Promise.all([
                getBudgetExpenses(id),
                getBudgetSummary(id),
            ]);

            setExpenses(Array.isArray(expenseData) ? expenseData : []);
            setSummary(summaryData || { total: 0, breakdown: {} });
        } catch (err) {
            console.error(err);
            setError(err.message || "Unable to load budget.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadBudget();
    }, [id]);

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!form.title || !form.amount || !form.category) {
            setError("Please fill in all required fields.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            await createBudgetExpense(id, {
                title: form.title,
                description: form.description,
                amount: Number(form.amount),
                category: form.category,
            });

            setForm({
                title: "",
                description: "",
                amount: "",
                category: "Other",
            });

            await loadBudget();
        } catch (err) {
            console.error(err);
            setError(err.message || "Unable to add expense.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(expenseId) {
        try {
            await deleteBudgetExpense(id, expenseId);
            await loadBudget();
        } catch (err) {
            console.error(err);
            setError(err.message || "Unable to delete expense.");
        }
    }

    if (loading) {
        return (
            <div className="dashboard-loading">
                Loading budget...
            </div>
        );
    }

    return (
        <div className="trip-page">
            <nav className="navbar">
                <div
                    className="logo"
                    onClick={() => navigate("/dashboard")}
                    style={{ cursor: "pointer" }}
                >
                     Globetrotter
                </div>

                <button
                    className="logout-button"
                    onClick={() => navigate(`/trips/${id}/activities`)}
                >
                    Back to Activities
                </button>
            </nav>

            <main className="trip-page-content">
                <div className="trip-form-header">
                    <p className="eyebrow">TRIP FINANCES</p>
                    <h1>Budget & Expenses </h1>
                    <p>
                        Track your estimated spending and keep your trip
                        within budget.
                    </p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="trips-grid">
                    <div className="trip-card">
                        <p className="eyebrow">TOTAL EXPENSES</p>
                        <h2>
                            Rs. {Number(summary.total || 0).toLocaleString("en-IN")}
                        </h2>
                    </div>

                    {Object.entries(summary.breakdown || {}).map(
                        ([category, amount]) => (
                            <div className="trip-card" key={category}>
                                <p className="eyebrow">{category}</p>
                                <h3>
                                    Rs. {Number(amount || 0).toLocaleString("en-IN")}
                                </h3>
                            </div>
                        )
                    )}
                </div>

                <form
                    className="trip-form-card"
                    onSubmit={handleSubmit}
                >
                    <h2>Add Expense</h2>

                    <div className="form-group">
                        <label>Title</label>
                        <input
                            name="title"
                            placeholder="e.g. Hotel in Goa"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <input
                            name="description"
                            placeholder="Optional"
                            value={form.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Amount (Rs.)</label>
                            <input
                                name="amount"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="5000"
                                value={form.amount}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Category</label>
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                            >
                                <option>Transport</option>
                                <option>Accommodation</option>
                                <option>Activities</option>
                                <option>Meals</option>
                                <option>Other</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={saving}
                    >
                        {saving ? "Adding..." : "+ Add Expense"}
                    </button>
                </form>

                <section className="trips-section">
                    <div className="section-header">
                        <h2>Expense List</h2>
                    </div>

                    {expenses.length === 0 ? (
                        <div className="empty-trips">
                            <h3>No expenses yet</h3>
                            <p>Add your first expense above.</p>
                        </div>
                    ) : (
                        <div className="trips-grid">
                            {expenses.map((expense) => (
                                <div
                                    className="trip-card"
                                    key={expense.id}
                                >
                                    <div className="trip-card-header">
                                        <div>
                                            <p className="eyebrow">
                                                {expense.category}
                                            </p>
                                            <h3>{expense.title}</h3>
                                            {expense.description && (
                                                <p>
                                                    {expense.description}
                                                </p>
                                            )}
                                        </div>

                                        <h3>
                                            Rs. {Number(
                                                expense.amount
                                            ).toLocaleString("en-IN")}
                                        </h3>
                                    </div>

                                    <div className="trip-actions">
                                        <button
                                            type="button"
                                            className="delete-button"
                                            onClick={() =>
                                                handleDelete(expense.id)
                                            }
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default Budget;
