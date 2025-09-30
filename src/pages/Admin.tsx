
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock, Plus, Trash2, Car, Settings as SettingsIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Vehicle {
  plateNumber: string;
  spotId: string;
  entryTime: number;
  planHours?: number;
  baseRateSnapshot?: number;
  overtimeRateSnapshot?: number;
}

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [spots, setSpots] = useState([
    { id: 'A-1', name: 'A-1', type: 'regular', occupied: false, plateNumber: '' },
    { id: 'A-2', name: 'A-2', type: 'regular', occupied: false, plateNumber: '' },
    { id: 'D-1', name: 'D-1', type: 'disability', occupied: false, plateNumber: '' },
    { id: 'E-1', name: 'E-1', type: 'electric', occupied: false, plateNumber: '' },
  ]);
  const [newSpot, setNewSpot] = useState({ id: '', name: '', type: 'regular' });
  const [newVehicle, setNewVehicle] = useState({ plateNumber: '', adminPassword: '', spotId: '' });
  const [removeVehicle, setRemoveVehicle] = useState({ plateNumber: '', adminPassword: '' });
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [isRemovingVehicle, setIsRemovingVehicle] = useState(false);
  const [isAddingSpot, setIsAddingSpot] = useState(false);
  const [revenue, setRevenue] = useState(0);
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [parkingHistory, setParkingHistory] = useState<Vehicle[]>([]);
  const [currentRates, setCurrentRates] = useState({ baseHourlyRate: 40, overtimeHourlyRate: 60 });

  // Sync data from localStorage - refresh every time component is visible
  const syncDataFromStorage = () => {
    const savedSpots = localStorage.getItem('parkingSpots');
    const savedVehicles = localStorage.getItem('parkedVehicles');
    const savedRevenue = localStorage.getItem('totalRevenue');
    const savedDailyRevenue = localStorage.getItem('dailyRevenue');
    
    // Set default spots if nothing saved
    const defaultSpots = [
      { id: 'A-1', name: 'A-1', type: 'regular', occupied: false, plateNumber: '' },
      { id: 'A-2', name: 'A-2', type: 'regular', occupied: false, plateNumber: '' },
      { id: 'D-1', name: 'D-1', type: 'disability', occupied: false, plateNumber: '' },
      { id: 'E-1', name: 'E-1', type: 'electric', occupied: false, plateNumber: '' },
    ];
    
    const spotsData = savedSpots ? JSON.parse(savedSpots) : defaultSpots;
    const vehiclesData = savedVehicles ? JSON.parse(savedVehicles) : [];
    
    // Sync spots with current vehicles
    const syncedSpots = spotsData.map(spot => {
      const vehicle = vehiclesData.find(v => v.spotId === spot.id);
      if (vehicle) {
        return { ...spot, occupied: true, plateNumber: vehicle.plateNumber };
      }
      return { ...spot, occupied: false, plateNumber: '' };
    });
    
    setSpots(syncedSpots);
    setVehicles(vehiclesData);
    
    // Load parking history for history section
    const savedHistory = localStorage.getItem('parkingHistory');
    const historyData = savedHistory ? JSON.parse(savedHistory) : [];
    setParkingHistory(historyData);
    
    // Load current rates
    const savedRates = localStorage.getItem('rateSettings');
    const ratesData = savedRates ? JSON.parse(savedRates) : { baseHourlyRate: 40, overtimeHourlyRate: 60 };
    setCurrentRates(ratesData);
    
    setRevenue(savedRevenue ? parseInt(savedRevenue) : 0);
    setDailyRevenue(savedDailyRevenue ? parseInt(savedDailyRevenue) : 0);
  };

  // Load data on mount and when returning to tab
  useEffect(() => {
    syncDataFromStorage();
    
    // Refresh data when tab becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        syncDataFromStorage();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also refresh data periodically while on admin page
    const interval = setInterval(syncDataFromStorage, 2000);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, []);


  // Save spots to localStorage whenever spots change
  useEffect(() => {
    localStorage.setItem('parkingSpots', JSON.stringify(spots));
  }, [spots]);

  // Save vehicles to localStorage whenever vehicles change
  useEffect(() => {
    localStorage.setItem('parkedVehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  const handleLogin = () => {
    if (password === "987321") {
      setIsAuthenticated(true);
      toast.success("Access granted! Welcome to Admin Panel");
    } else {
      toast.error("Invalid password! Please try again.");
      setPassword("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleAddSpot = () => {
    if (newSpot.id && newSpot.name) {
      const spotToAdd = { ...newSpot, name: newSpot.id, occupied: false, plateNumber: '' };
      setSpots([...spots, spotToAdd]);
      setNewSpot({ id: '', name: '', type: 'regular' });
      setIsAddingSpot(false);
      toast.success("Parking spot added successfully!");
    } else {
      toast.error("Please fill in all fields");
    }
  };

  const handleDeleteSpot = (spotId: string) => {
    setSpots(spots.filter(spot => spot.id !== spotId));
    toast.success("Parking spot deleted successfully!");
  };

  const handleAddVehicle = () => {
    if (newVehicle.plateNumber && newVehicle.adminPassword && newVehicle.spotId) {
      if (newVehicle.adminPassword !== "987321") {
        toast.error("Invalid admin password!");
        return;
      }
      const spot = spots.find(s => s.id === newVehicle.spotId && !s.occupied);
      if (!spot) {
        toast.error("Selected spot is not available!");
        return;
      }

      // Mark spot as occupied and add plate number
      const updatedSpots = spots.map(s => 
        s.id === newVehicle.spotId ? { ...s, occupied: true, plateNumber: newVehicle.plateNumber } : s
      );
      setSpots(updatedSpots);

      // Add vehicle to vehicles list
      const newVehicleData: Vehicle = {
        plateNumber: newVehicle.plateNumber,
        spotId: newVehicle.spotId,
        entryTime: Date.now(),
        planHours: 4,
        baseRateSnapshot: currentRates.baseHourlyRate,
        overtimeRateSnapshot: currentRates.overtimeHourlyRate
      };
      setVehicles([...vehicles, newVehicleData]);

      // Also add to parking history
      const updatedHistory = [...parkingHistory, newVehicleData];
      setParkingHistory(updatedHistory);
      localStorage.setItem('parkingHistory', JSON.stringify(updatedHistory));

      // Add revenue
      const baseAmount = 4 * currentRates.baseHourlyRate;
      const newTotalRevenue = revenue + baseAmount;
      const newDailyRev = dailyRevenue + baseAmount;
      setRevenue(newTotalRevenue);
      setDailyRevenue(newDailyRev);
      localStorage.setItem('totalRevenue', newTotalRevenue.toString());
      localStorage.setItem('dailyRevenue', newDailyRev.toString());

      setNewVehicle({ plateNumber: '', adminPassword: '', spotId: '' });
      setIsAddingVehicle(false);
      toast.success("Vehicle added successfully!");
    } else {
      toast.error("Please fill in all fields");
    }
  };

  const handleRemoveVehicle = () => {
    if (removeVehicle.plateNumber && removeVehicle.adminPassword) {
      if (removeVehicle.adminPassword !== "987321") {
        toast.error("Invalid admin password!");
        return;
      }

      // Find the vehicle
      const vehicleToRemove = vehicles.find(v => v.plateNumber === removeVehicle.plateNumber);
      if (!vehicleToRemove) {
        toast.error("Vehicle not found!");
        return;
      }

      // Free up the spot
      const updatedSpots = spots.map(s => 
        s.id === vehicleToRemove.spotId ? { ...s, occupied: false, plateNumber: '' } : s
      );
      setSpots(updatedSpots);

      // Remove vehicle from vehicles list
      const updatedVehicles = vehicles.filter(v => v.plateNumber !== removeVehicle.plateNumber);
      setVehicles(updatedVehicles);
      
      setRemoveVehicle({ plateNumber: '', adminPassword: '' });
      setIsRemovingVehicle(false);
      toast.success("Vehicle removed successfully!");
    } else {
      toast.error("Please fill in all fields");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 flex items-center justify-center">
        <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-6 bg-blue-600/20 rounded-full w-fit">
              <Lock className="h-16 w-16 text-blue-500" />
            </div>
            <CardTitle className="text-2xl text-white">Admin Access</CardTitle>
            <CardDescription className="text-slate-400">
              Enter password to access admin panel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                className="bg-slate-900 border-slate-600 text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <div className="flex gap-4">
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={handleLogin}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Lock className="h-4 w-4 mr-2" />
                Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
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
          <div className="flex gap-3">
            <Button 
              onClick={() => navigate('/settings')}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <SettingsIcon className="h-4 w-4 mr-2" />
              Rate Settings
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <Lock className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Current Rates Display */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Current Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 p-4 rounded-lg">
                <span className="text-slate-400">Base Hourly Rate:</span>
                <span className="text-green-500 font-bold ml-2">₹{currentRates.baseHourlyRate}/hr</span>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg">
                <span className="text-slate-400">Overtime Hourly Rate:</span>
                <span className="text-orange-500 font-bold ml-2">₹{currentRates.overtimeHourlyRate}/hr</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300 text-sm font-medium">Total Spots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{spots.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300 text-sm font-medium">Available Spots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {spots.filter(s => !s.occupied).length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300 text-sm font-medium">Occupied Spots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {spots.filter(s => s.occupied).length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300 text-sm font-medium">Cars Parked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {spots.filter(s => s.occupied).length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300 text-sm font-medium">Daily Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">₹{dailyRevenue}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300 text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-500">₹{revenue}</div>
            </CardContent>
          </Card>
        </div>

        {/* Spot Management */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Parking Spot Management</CardTitle>
                <CardDescription className="text-slate-400">
                  Add, edit, or manage parking spots and their occupancy
                </CardDescription>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setIsAddingSpot(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Spot
                </Button>
                <Button 
                  onClick={() => setIsAddingVehicle(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vehicle
                </Button>
                <Button 
                  onClick={() => setIsRemovingVehicle(true)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Vehicle
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Add New Spot Form */}
            {isAddingSpot && (
              <Card className="mb-6 bg-slate-900/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Add New Parking Spot</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">Spot ID/Name</Label>
                      <Input
                        placeholder="e.g., A-15"
                        className="bg-slate-800 border-slate-600 text-white"
                        value={newSpot.id}
                        onChange={(e) => setNewSpot({...newSpot, id: e.target.value, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Type</Label>
                      <select
                        className="w-full p-2 bg-slate-800 border border-slate-600 text-white rounded-md"
                        value={newSpot.type}
                        onChange={(e) => setNewSpot({...newSpot, type: e.target.value})}
                      >
                        <option value="regular">Regular</option>
                        <option value="disability">Disability</option>
                        <option value="electric">Electric</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button 
                      onClick={handleAddSpot}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Spot
                    </Button>
                    <Button 
                      onClick={() => {
                        setIsAddingSpot(false);
                        setNewSpot({ id: '', name: '', type: 'regular' });
                      }}
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-800"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Add New Vehicle Form */}
            {isAddingVehicle && (
              <Card className="mb-6 bg-slate-900/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Add New Vehicle</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-slate-300">Plate Number</Label>
                      <Input
                        placeholder="e.g., MH12AB1234"
                        className="bg-slate-800 border-slate-600 text-white"
                        value={newVehicle.plateNumber}
                        onChange={(e) => setNewVehicle({...newVehicle, plateNumber: e.target.value})}
                      />
                    </div>
                     <div>
                       <Label className="text-slate-300">Admin Password</Label>
                       <Input
                         type="password"
                         placeholder="Enter admin password"
                         className="bg-slate-800 border-slate-600 text-white"
                         value={newVehicle.adminPassword}
                         onChange={(e) => setNewVehicle({...newVehicle, adminPassword: e.target.value})}
                       />
                     </div>
                    <div>
                      <Label className="text-slate-300">Assign to Spot</Label>
                      <select
                        className="w-full p-2 bg-slate-800 border border-slate-600 text-white rounded-md"
                        value={newVehicle.spotId}
                        onChange={(e) => setNewVehicle({...newVehicle, spotId: e.target.value})}
                      >
                         <option value="">Select available spot</option>
                         {spots.filter(s => !s.occupied)
                           .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))
                           .map(spot => (
                           <option key={spot.id} value={spot.id}>
                             {spot.id} ({spot.type})
                           </option>
                         ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button 
                      onClick={handleAddVehicle}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Car className="h-4 w-4 mr-2" />
                      Add Vehicle
                    </Button>
                    <Button 
                      onClick={() => {
                        setIsAddingVehicle(false);
                        setNewVehicle({ plateNumber: '', adminPassword: '', spotId: '' });
                      }}
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-800"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Remove Vehicle Form */}
            {isRemovingVehicle && (
              <Card className="mb-6 bg-slate-900/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Remove Vehicle</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">Plate Number</Label>
                      <Input
                        placeholder="e.g., MH12AB1234"
                        className="bg-slate-800 border-slate-600 text-white"
                        value={removeVehicle.plateNumber}
                        onChange={(e) => setRemoveVehicle({...removeVehicle, plateNumber: e.target.value})}
                      />
                    </div>
                     <div>
                       <Label className="text-slate-300">Admin Password</Label>
                       <Input
                         type="password"
                         placeholder="Enter admin password"
                         className="bg-slate-800 border-slate-600 text-white"
                         value={removeVehicle.adminPassword}
                         onChange={(e) => setRemoveVehicle({...removeVehicle, adminPassword: e.target.value})}
                       />
                     </div>
                  </div>
                  <div className="flex gap-4">
                    <Button 
                      onClick={handleRemoveVehicle}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Vehicle
                    </Button>
                    <Button 
                      onClick={() => {
                        setIsRemovingVehicle(false);
                        setRemoveVehicle({ plateNumber: '', adminPassword: '' });
                      }}
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-800"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Spots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {spots.map((spot) => (
                <Card key={spot.id} className={`${
                  spot.occupied 
                    ? 'bg-red-900/30 border-red-600/50' 
                    : 'bg-green-900/30 border-green-600/50'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`px-3 py-1 rounded text-xs font-semibold ${
                        spot.type === 'disability' 
                          ? 'bg-purple-600/20 text-purple-400' 
                          : spot.type === 'electric'
                          ? 'bg-yellow-600/20 text-yellow-400'
                          : 'bg-blue-600/20 text-blue-400'
                      }`}>
                        {spot.id}
                      </div>
                      <div className={`w-8 h-8 rounded flex items-center justify-center ${
                        spot.occupied ? 'bg-red-500' : 'bg-green-500'
                      }`}>
                        <div className={`w-4 h-4 rounded ${
                          spot.occupied ? 'bg-red-300' : 'bg-green-300'
                        }`} />
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="text-white font-semibold">{spot.name}</div>
                      <div className="text-slate-400 text-sm capitalize">{spot.type} Parking</div>
                      <div className={`text-sm font-medium ${
                        spot.occupied ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {spot.occupied ? 'OCCUPIED' : 'AVAILABLE'}
                      </div>
                      {spot.occupied && spot.plateNumber && (
                        <div className="text-yellow-400 text-sm font-bold mt-2 p-2 bg-slate-900/50 rounded border">
                          🚗 {spot.plateNumber}
                        </div>
                      )}
                    </div>
                     <div className="flex gap-2">
                       <Button 
                         onClick={() => handleDeleteSpot(spot.id)}
                         variant="outline"
                         size="sm"
                         className="border-red-600 text-red-400 hover:bg-red-600/20 w-full"
                       >
                         <Trash2 className="h-4 w-4 mr-1" />
                         Delete Spot
                       </Button>
                     </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Last 5 History Section */}
            <Card className="mt-6 bg-slate-900/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Last 5 Parking History</CardTitle>
                <CardDescription className="text-slate-400">
                  Recent parking activities and transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {parkingHistory.length === 0 ? (
                  <div className="text-slate-400 text-center py-4">No parking history available</div>
                ) : (
                  <div className="space-y-2">
                    {parkingHistory.slice(-5).reverse().map((vehicle, index) => (
                      <div key={`${vehicle.plateNumber}-${vehicle.entryTime}-${index}`} className="flex items-center justify-between p-3 bg-slate-800/50 rounded border border-slate-700">
                        <div className="flex items-center gap-4">
                          <div className="text-yellow-400 font-bold">🚗 {vehicle.plateNumber}</div>
                          <div className="text-slate-300">Spot: {vehicle.spotId}</div>
                          <div className="text-slate-400 text-sm">
                            {new Date(vehicle.entryTime).toLocaleString()}
                          </div>
                          <div className="text-blue-400 text-sm">
                            Plan: {vehicle.planHours || 4}h
                          </div>
                        </div>
                        <div className="text-green-400 font-semibold">
                          ₹{(vehicle.planHours || 4) * (vehicle.baseRateSnapshot || 40)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
