
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, MapPin, Settings, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();

  const parkingSpots = [
    { id: 'A-1', status: 'occupied', type: 'regular', plate: 'MH12AB1234' },
    { id: 'A-2', status: 'available', type: 'regular', plate: '' },
    { id: 'A-3', status: 'occupied', type: 'regular', plate: 'KA05CD5678' },
    { id: 'D-1', status: 'available', type: 'disability', plate: '' },
    { id: 'D-2', status: 'occupied', type: 'disability', plate: 'MH14EF9012' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300 text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">₹12,450</div>
              <p className="text-slate-500 text-sm">Today</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300 text-sm font-medium">Vehicles Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">89</div>
              <p className="text-slate-500 text-sm">Entry/Exit</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300 text-sm font-medium">Avg Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-500">3.2h</div>
              <p className="text-slate-500 text-sm">Per vehicle</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300 text-sm font-medium">Occupancy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">53%</div>
              <p className="text-slate-500 text-sm">Current</p>
            </CardContent>
          </Card>
        </div>

        {/* Parking Grid */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Live Parking Status</CardTitle>
            <CardDescription className="text-slate-400">
              Real-time view of all parking spots
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
              {Array.from({ length: 50 }, (_, i) => {
                const spotId = `A-${i + 1}`;
                const isOccupied = Math.random() > 0.5;
                return (
                  <div
                    key={spotId}
                    className={`aspect-square rounded-lg border-2 flex items-center justify-center text-xs font-semibold ${
                      isOccupied
                        ? 'bg-red-600/20 border-red-600 text-red-400'
                        : 'bg-green-600/20 border-green-600 text-green-400'
                    }`}
                  >
                    {spotId}
                  </div>
                );
              })}
            </div>
            
            {/* Disability Spots */}
            <div className="mt-6">
              <h3 className="text-white font-semibold mb-3">Accessibility Spots</h3>
              <div className="grid grid-cols-5 gap-3">
                {Array.from({ length: 5 }, (_, i) => {
                  const spotId = `D-${i + 1}`;
                  const isOccupied = i < 2;
                  return (
                    <div
                      key={spotId}
                      className={`aspect-square rounded-lg border-2 flex items-center justify-center text-xs font-semibold ${
                        isOccupied
                          ? 'bg-purple-600/20 border-purple-600 text-purple-400'
                          : 'bg-purple-600/10 border-purple-500 text-purple-300'
                      }`}
                    >
                      {spotId}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-600/20 border border-green-600 rounded"></div>
                <span className="text-slate-400">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-600/20 border border-red-600 rounded"></div>
                <span className="text-slate-400">Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-600/20 border border-purple-600 rounded"></div>
                <span className="text-slate-400">Accessible</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-slate-400">
              Latest entry and exit records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: '14:32', action: 'EXIT', plate: 'MH12AB1234', spot: 'A-15', duration: '2.5h', amount: '₹50' },
                { time: '14:28', action: 'ENTRY', plate: 'KA05CD5678', spot: 'D-2', duration: '-', amount: '₹59' },
                { time: '14:15', action: 'EXIT', plate: 'TN09EF9012', spot: 'A-23', duration: '5.2h', amount: '₹74' },
                { time: '14:02', action: 'ENTRY', plate: 'DL08GH3456', spot: 'A-08', duration: '-', amount: '₹50' },
              ].map((record, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-slate-400 text-sm w-12">{record.time}</div>
                    <div className={`px-2 py-1 rounded text-xs font-semibold ${
                      record.action === 'ENTRY' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                    }`}>
                      {record.action}
                    </div>
                    <div className="text-white font-mono">{record.plate}</div>
                    <div className="text-slate-400">Spot {record.spot}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-slate-400">{record.duration}</div>
                    <div className="text-white font-semibold">{record.amount}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
