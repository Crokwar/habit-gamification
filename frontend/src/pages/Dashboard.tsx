import { Checklist } from "@/components/CheckList";
import { Navbar } from "@/components/common/Navbar";

function Dashboard() {

  return (
    <div className="min-h-screen bg-[#cebea4] p-4 sm:p-6">
      <div className="min-h-full bg-black text-[#cebea4] rounded-3xl border border-[#cebea4]/60 overflow-hidden px-6 pt-10 pb-10 sm:px-10 sm:pt-16 sm:pb-12">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/**Encabezado de Hábitos*/}
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Actividades de hoy</h2>
          </div>

          {/**Checklist de Hábitos*/}
          <Checklist />

        </main>
      </div>
    </div>
  );
}

export default Dashboard;
