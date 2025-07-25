
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, LogOut, Users, Settings, TrendingUp, MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [spots, setSpots] = useState([
    { id: 'A-1', name: 'A-1', type: 'regular', occupied: false },
    { id: 'A-2', name: 'A-2', type: 'regular', occupied: false },
    { id: 'D-1', name: 'D-1', type: 'disability', occupied: false },
    { id: 'E-1', name: 'E-1', type: 'electric', occupied: false },
  ]);
  const [revenue, setRevenue] = useState(0);

  // Load spots from localStorage if available
  useEffect(() => {
    const savedSpots = localStorage.getItem('parkingSpots');
    if (savedSpots) {
      setSpots(JSON.parse(savedSpots));
    }
  }, []);

  // Load revenue from localStorage
  useEffect(() => {
    const savedRevenue = localStorage.getItem('totalRevenue');
    if (savedRevenue) {
      setRevenue(parseInt(savedRevenue));
    }
  }, [spots]);

  // Get current vehicle data to update spot occupancy
  useEffect(() => {
    const currentVehicle = localStorage.getItem('currentVehicle');
    if (currentVehicle) {
      const vehicleData = JSON.parse(currentVehicle);
      setSpots(prevSpots => 
        prevSpots.map(spot => 
          spot.id === vehicleData.spot 
            ? { ...spot, occupied: true }
            : spot
        )
      );
    }
  }, []);

  // Get real stats from spots data
  const totalSpots = spots.length;
  const occupiedSpots = spots.filter(s => s.occupied).length;
  const availableSpots = totalSpots - occupiedSpots;

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
            className="bg-slate-800/50 border-slate-700 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/entry')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-6 bg-green-600/20 rounded-full w-fit">
                <Car className="h-16 w-16 text-green-400" />
              </div>
              <CardTitle className="text-2xl text-white">Vehicle Entry</CardTitle>
              <CardDescription className="text-slate-300">
                Start the parking process for new vehicles
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="bg-green-700 hover:bg-green-600 text-white py-3 px-8 text-lg">
                Start Entry Process
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="bg-slate-800/50 border-slate-700 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/exit')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-6 bg-red-600/20 rounded-full w-fit">
                <LogOut className="h-16 w-16 text-red-400" />
              </div>
              <CardTitle className="text-2xl text-white">Vehicle Exit</CardTitle>
              <CardDescription className="text-slate-300">
                Process vehicle exit and payment
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="bg-red-700 hover:bg-red-600 text-white py-3 px-8 text-lg">
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
              <div className="text-2xl font-bold text-green-500">{availableSpots}</div>
              <p className="text-slate-500 text-sm">out of {totalSpots} total</p>
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
              <div className="text-2xl font-bold text-orange-500">{occupiedSpots}</div>
              <p className="text-slate-500 text-sm">{totalSpots > 0 ? Math.round((occupiedSpots / totalSpots) * 100) : 0}% occupancy</p>
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
              <div className="text-2xl font-bold text-blue-500">4h</div>
              <p className="text-slate-500 text-sm">per vehicle</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-300 text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Active Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-500">{occupiedSpots}</div>
              <p className="text-slate-500 text-sm">current vehicles</p>
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
                variant="outline"
                className="border-slate-600 bg-slate-700/50 text-slate-300 hover:bg-slate-600 py-2 px-6"
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
