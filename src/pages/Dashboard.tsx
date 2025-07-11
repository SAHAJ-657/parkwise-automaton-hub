
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, LogOut, Settings, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">ParkWise</h1>
          <p className="text-slate-300 text-xl">Smart Parking Management System</p>
        </div>

        {/* Main Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 cursor-pointer transform hover:scale-105" onClick={() => navigate('/entry')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-6 bg-green-600/20 rounded-full w-fit">
                <Car className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-3xl text-white">Vehicle Entry</CardTitle>
              <CardDescription className="text-slate-400 text-lg">
                Register new vehicle and assign parking spot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full py-6 text-xl bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                Start Entry Process
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 cursor-pointer transform hover:scale-105" onClick={() => navigate('/exit')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-6 bg-red-600/20 rounded-full w-fit">
                <LogOut className="h-16 w-16 text-red-500" />
              </div>
              <CardTitle className="text-3xl text-white">Vehicle Exit</CardTitle>
              <CardDescription className="text-slate-400 text-lg">
                Process vehicle exit and payment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full py-6 text-xl bg-red-600 hover:bg-red-700 text-white"
                size="lg"
              >
                Start Exit Process
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800/30 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-300 text-sm font-medium">Available Spots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">47</div>
              <p className="text-slate-500 text-sm">out of 100 total</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/30 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-300 text-sm font-medium">Occupied Spots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">53</div>
              <p className="text-slate-500 text-sm">currently parked</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/30 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-300 text-sm font-medium">Disability Spots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-500">3</div>
              <p className="text-slate-500 text-sm">2 available</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Actions */}
        <div className="flex justify-center gap-4">
          <Button 
            variant="outline" 
            className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
            onClick={() => navigate('/admin')}
          >
            <Settings className="mr-2 h-5 w-5" />
            Admin Panel
          </Button>
          <Button 
            variant="outline" 
            className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
            onClick={() => navigate('/reports')}
          >
            <BarChart3 className="mr-2 h-5 w-5" />
            Reports
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
