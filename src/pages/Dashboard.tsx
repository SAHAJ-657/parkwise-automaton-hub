
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, LogOut, Users, Settings, TrendingUp, MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">ParkWise</h1>
          <p className="text-xl text-slate-300">Smart Parking Management System</p>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card 
            className="bg-gradient-to-br from-green-600/20 to-green-700/30 border-green-600/50 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/entry')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-6 bg-green-600/30 rounded-full w-fit">
                <Car className="h-16 w-16 text-green-400" />
              </div>
              <CardTitle className="text-2xl text-white">Vehicle Entry</CardTitle>
              <CardDescription className="text-green-200">
                Start the parking process for new vehicles
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 text-lg">
                Start Entry Process
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-red-600/20 to-red-700/30 border-red-600/50 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/exit')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-6 bg-red-600/30 rounded-full w-fit">
                <LogOut className="h-16 w-16 text-red-400" />
              </div>
              <CardTitle className="text-2xl text-white">Vehicle Exit</CardTitle>
              <CardDescription className="text-red-200">
                Process vehicle exit and payment
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="bg-red-600 hover:bg-red-700 text-white py-3 px-8 text-lg">
                Start Exit Process
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-300 text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Available Spots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">23</div>
              <p className="text-slate-500 text-sm">out of 50 total</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-300 text-sm font-medium flex items-center gap-2">
                <Car className="h-4 w-4" />
                Occupied Spots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">27</div>
              <p className="text-slate-500 text-sm">54% occupancy</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-300 text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Avg Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">3.2h</div>
              <p className="text-slate-500 text-sm">per vehicle</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-300 text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Today's Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-500">₹8,450</div>
              <p className="text-slate-500 text-sm">from 34 vehicles</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Access */}
        <div className="text-center">
          <Card className="bg-slate-800/30 border-slate-600 inline-block">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">System Management</h3>
              <Button 
                onClick={() => navigate('/admin')}
                className="bg-slate-600 hover:bg-slate-500 text-white py-2 px-6"
              >
                <Settings className="h-5 w-5 mr-2" />
                Admin Panel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
