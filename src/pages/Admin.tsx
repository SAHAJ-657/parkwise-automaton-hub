
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock, Plus, Trash2, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [spots, setSpots] = useState([
    { id: 'A-1', name: 'Regular Spot 1', type: 'regular' },
    { id: 'A-2', name: 'Regular Spot 2', type: 'regular' },
    { id: 'D-1', name: 'Accessible Spot 1', type: 'disability' },
  ]);
  const [newSpot, setNewSpot] = useState({ id: '', name: '', type: 'regular' });
  const [isAddingSpot, setIsAddingSpot] = useState(false);

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
      setSpots([...spots, { ...newSpot }]);
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
              <CardTitle className="text-slate-300 text-sm font-medium">Regular Spots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {spots.filter(s => s.type === 'regular').length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300 text-sm font-medium">Accessible Spots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-500">
                {spots.filter(s => s.type === 'disability').length}
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
                  Add, edit, or remove parking spots
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
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-slate-300">Spot ID</Label>
                      <Input
                        placeholder="e.g., A-15"
                        className="bg-slate-800 border-slate-600 text-white"
                        value={newSpot.id}
                        onChange={(e) => setNewSpot({...newSpot, id: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Spot Name</Label>
                      <Input
                        placeholder="e.g., Regular Spot 15"
                        className="bg-slate-800 border-slate-600 text-white"
                        value={newSpot.name}
                        onChange={(e) => setNewSpot({...newSpot, name: e.target.value})}
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
                        <option value="disability">Accessible</option>
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

            {/* Spots List */}
            <div className="space-y-4">
              {spots.map((spot) => (
                <div key={spot.id} className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded text-xs font-semibold ${
                      spot.type === 'disability' 
                        ? 'bg-purple-600/20 text-purple-400' 
                        : 'bg-green-600/20 text-green-400'
                    }`}>
                      {spot.id}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{spot.name}</div>
                      <div className="text-slate-400 text-sm capitalize">{spot.type} Parking</div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleDeleteSpot(spot.id)}
                    variant="outline"
                    size="sm"
                    className="border-red-600 text-red-400 hover:bg-red-600/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
