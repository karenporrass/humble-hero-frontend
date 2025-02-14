import { useEffect, useState } from "react";
import { getSuperheroes, addSuperhero } from "../api/superheroes";
import { Superhero } from "../types/superhero";

const SuperheroList = () => {
  const [superheroes, setSuperheroes] = useState<Superhero[]>([]);
  const [newHero, setNewHero] = useState<Omit<Superhero, "id">>({
    name: "",
    superpower: "",
    humilityScore: 0,
  });
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendErrors, setBackendErrors] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data: Superhero[] = await getSuperheroes();
      setSuperheroes(data);
    };
    fetchData();
  }, []);

  const validateInputs = () => {
    if (!newHero.name || !newHero.superpower || newHero.humilityScore === 0) {
      return "Todos los campos son obligatorios.";
    }
    if (newHero.name.length < 3) {
      return "El nombre debe tener al menos 3 caracteres.";
    }
    if (newHero.humilityScore < 1 || newHero.humilityScore > 10) {
      return "El humilityScore debe estar entre 1 y 10.";
    }
    return null;
  };

  const handleBackendErrors = (error: any) => {
    if (error.response && error.response.data) {
      const backendErrorMessages =
        error.response.data?.message || "Error desconocido.";
      setBackendErrors(backendErrorMessages);
    } else {
      setBackendErrors("No se pudo conectar con el servidor.");
    }
  };

  const handleAddHero = async () => {
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null); 
    setBackendErrors(null); 
    try {
      const createdHero = await addSuperhero(newHero);
      setSuperheroes([...superheroes, createdHero]);
      setNewHero({ name: "", superpower: "", humilityScore: 0 });
      setIsAdding(false);
    } catch (error) {
      handleBackendErrors(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">
        Superhero Database
      </h2>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      {backendErrors && (
        <div className="text-red-500 text-center mb-4">
          <strong>Error del servidor:</strong> {backendErrors}
        </div>
      )}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Superpower</th>
            <th className="border p-2">Humility Score</th>
            {isAdding && <th className="border p-2">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {isAdding && (
            <tr className="text-center border bg-gray-100">
              <td className="p-2">
                <input
                  className="border p-1"
                  type="text"
                  placeholder="Name"
                  value={newHero.name}
                  onChange={(e) =>
                    setNewHero({ ...newHero, name: e.target.value })
                  }
                />
              </td>
              <td className="p-2">
                <input
                  className="border p-1"
                  type="text"
                  placeholder="Superpower"
                  value={newHero.superpower}
                  onChange={(e) =>
                    setNewHero({ ...newHero, superpower: e.target.value })
                  }
                />
              </td>
              <td className="p-2">
                <input
                  className="border p-1"
                  type="number"
                  placeholder="Score (1-10)"
                  min={1}
                  max={10}
                  value={newHero.humilityScore}
                  onChange={(e) =>
                    setNewHero({
                      ...newHero,
                      humilityScore: Number(e.target.value),
                    })
                  }
                />
              </td>
              <td className="p-2">
                <button
                  onClick={handleAddHero}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Save
                </button>

                <button
                  onClick={() => setIsAdding(false)}
                  className="ml-4 bg-gray-500 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </td>
            </tr>
          )}
          {superheroes.map((hero) => (
            <tr key={hero.id} className="text-center border">
              <td className="p-2">{hero.name}</td>
              <td className="p-2">{hero.superpower}</td>
              <td className="p-2">{hero.humilityScore}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center">
        <button
          onClick={() => setIsAdding(true)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Superhero
        </button>
      </div>
    </div>
  );
};

export default SuperheroList;
