
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock, Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [spots, setSpots] = useState([
    { id: 'A-1', name: 'A-1', type: 'regular', occupied: false },
    { id: 'A-2', name: 'A-2', type: 'regular', occupied: false },
    { id: 'D-1', name: 'D-1', type: 'disability', occupied: false },
  ]);
  const [newSpot, setNewSpot] = useState({ id: '', name: '', type: 'regular' });
  const [isAddingSpot, setIsAddingSpot] = useState(false);

  // Load spots from localStorage on component mount
  useEffect(() => {
    const savedSpots = localStorage.getItem('parkingSpots');
    if (savedSpots) {
      setSpots(JSON.parse(savedSpots));
    }
  }, []);

  // Save spots to localStorage whenever spots change
  useEffect(() => {
    localStorage.setItem('parkingSpots', JSON.stringify(spots));
  }, [spots]);

  const handleLogin = () => {
    if (password === "987321") {
      setIsAuthenticated(true);
      toast.success("Access granted! Welcome to Admin Panel");
    } else {
      toast.error("Invalid password! Please try again.");
      setPassword("");
    }
  };

  const handleAddSpot = () => {
    if (newSpot.id && newSpot.name) {
      const spotToAdd = { ...newSpot, name: newSpot.id, occupied: false };
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

  const handleToggleOccupancy = (spotId: string) => {
    setSpots(spots.map(spot => 
      spot.id === spotId ? { ...spot, occupied: !spot.occupied } : spot
    ));
    const spot = spots.find(s => s.id === spotId);
    toast.success(`Spot ${spotId} marked as ${spot?.occupied ? 'available' : 'occupied'}`);
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
          <Button 
            onClick={() => setIsAuthenticated(false)}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <Lock className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Current Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              <Button 
                onClick={() => setIsAddingSpot(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Spot
              </Button>
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
                          : 'bg-blue-600/20 text-blue-400'
                      }`}>
                        {spot.id}
                      </div>
                      <div className={`w-4 h-4 rounded-full ${
                        spot.occupied ? 'bg-red-500' : 'bg-green-500'
                      }`} />
                    </div>
                    <div className="mb-3">
                      <div className="text-white font-semibold">{spot.name}</div>
                      <div className="text-slate-400 text-sm capitalize">{spot.type} Parking</div>
                      <div className={`text-sm font-medium ${
                        spot.occupied ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {spot.occupied ? 'OCCUPIED' : 'AVAILABLE'}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleToggleOccupancy(spot.id)}
                        size="sm"
                        className={`flex-1 ${
                          spot.occupied 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-red-600 hover:bg-red-700'
                        }`}
                      >
                        {spot.occupied ? (
                          <>
                            <ToggleRight className="h-4 w-4 mr-1" />
                            Mark Available
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="h-4 w-4 mr-1" />
                            Mark Occupied
                          </>
                        )}
                      </Button>
                      <Button 
                        onClick={() => handleDeleteSpot(spot.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-600 text-red-400 hover:bg-red-600/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
