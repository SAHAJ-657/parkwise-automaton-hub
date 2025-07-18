
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Camera, Clock, CreditCard, CheckCircle, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Exit = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [manualPlate, setManualPlate] = useState("");
  const [exitData, setExitData] = useState({
    plateNumber: "",
    entryTime: "",
    exitTime: "",
    duration: 0,
    baseAmount: 50,
    overtimeFee: 0,
    totalAmount: 0,
    spot: ""
  });

  const handlePlateCapture = () => {
    // Show camera not connected popup in bottom right
    toast.error("Camera not connected - enter manually", {
      position: "bottom-right"
    });
  };

  const handleActualPlateCapture = () => {
    const plateToUse = manualPlate || "MH12AB1234";
    
    // Get stored vehicle data
    const storedVehicle = localStorage.getItem('currentVehicle');
    let entryTime, spot;
    
    if (storedVehicle) {
      const vehicleData = JSON.parse(storedVehicle);
      entryTime = new Date(vehicleData.entryTime);
      spot = vehicleData.spot;
    } else {
      // Vehicle not found - allow exit
      toast.success("Vehicle not found - Exit granted!");
      setTimeout(() => navigate('/'), 2000);
      return;
    }
    
    const exitTime = new Date();
    const durationMs = exitTime.getTime() - entryTime.getTime();
    const durationHours = Math.max(0.1, Math.round((durationMs / (1000 * 60 * 60)) * 10) / 10);
    const overtimeFee = durationHours > 4 ? Math.round((durationHours - 4) * 12) : 0;

    setExitData({
      plateNumber: plateToUse,
      entryTime: entryTime.toLocaleString(),
      exitTime: exitTime.toLocaleString(),
      duration: durationHours,
      baseAmount: 40,
      overtimeFee,
      totalAmount: 0, // Customer already paid
      spot: spot
    });

    toast.success("Vehicle found in system!");
    setStep(2);
  };

  const handleManualSearch = () => {
    if (manualPlate) {
      handleActualPlateCapture();
    }
  };

  const handleExit = () => {
    // Update spot occupancy and clear stored vehicle data
    const savedSpots = localStorage.getItem('parkingSpots');
    if (savedSpots) {
      const spots = JSON.parse(savedSpots);
      const updatedSpots = spots.map(spot => 
        spot.id === exitData.spot ? { ...spot, occupied: false } : spot
      );
      localStorage.setItem('parkingSpots', JSON.stringify(updatedSpots));
    }
    
    // Revenue should NOT decrease when vehicle exits (already paid)
    localStorage.removeItem('currentVehicle');
    toast.success("Thank you for using ParkWise! Have a great day!");
    setTimeout(() => {
      toast.success(`Spot ${exitData.spot} is now available`);
      navigate('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
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
          <h1 className="text-3xl font-bold text-white">Vehicle Exit</h1>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  step >= i ? 'bg-red-600' : 'bg-slate-600'
                }`}>
                  {i}
                </div>
                {i < 2 && <div className={`w-16 h-1 ${step > i ? 'bg-red-600' : 'bg-slate-600'}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Vehicle Identification */}
        {step === 1 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-6 bg-red-600/20 rounded-full w-fit">
                <Camera className="h-16 w-16 text-red-500" />
              </div>
              <CardTitle className="text-2xl text-white">Identify Vehicle</CardTitle>
              <CardDescription className="text-slate-400">
                Scan the number plate to look up parking session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-900/50 p-8 rounded-lg border-2 border-dashed border-slate-600 text-center">
                <Camera className="h-24 w-24 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">Camera feed will appear here</p>
                <p className="text-slate-500 text-sm mt-2">Camera not connected</p>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={handlePlateCapture}
                  className="bg-red-600 hover:bg-red-700 text-white py-6 px-12 text-xl"
                  size="lg"
                >
                  <Camera className="mr-3 h-6 w-6" />
                  Scan Number Plate
                </Button>
              </div>

              {/* Manual Entry Option */}
              <div className="border-t border-slate-600 pt-6">
                <Label htmlFor="manual-plate" className="text-slate-300 text-lg">Manual Lookup</Label>
                <div className="flex gap-4 mt-2">
                  <Input 
                    id="manual-plate"
                    placeholder="Enter number plate to search"
                    className="bg-slate-900 border-slate-600 text-white"
                    value={manualPlate}
                    onChange={(e) => setManualPlate(e.target.value)}
                  />
                  <Button 
                    onClick={handleManualSearch}
                    disabled={!manualPlate}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-300"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Exit Processing */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Vehicle Info */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  Vehicle Found
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Number Plate: <span className="text-white font-mono text-lg">{exitData.plateNumber}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Parking Spot:</span>
                      <span className="text-white font-semibold">{exitData.spot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Entry Time:</span>
                      <span className="text-white">{exitData.entryTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Exit Time:</span>
                      <span className="text-white">{exitData.exitTime}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Duration:</span>
                      <span className="text-white font-semibold">{exitData.duration}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <span className="text-green-400 font-semibold">PAID</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Amount Due:</span>
                      <span className="text-green-400 font-semibold">₹0</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exit Section */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-6 bg-green-600/20 rounded-full w-fit">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <CardTitle className="text-2xl text-white">Ready to Exit</CardTitle>
                <CardDescription className="text-slate-400">
                  Payment already completed. You can exit now.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-slate-900/50 p-6 rounded-lg text-center">
                  <h3 className="text-lg text-slate-400 mb-2">Amount Due</h3>
                  <div className="text-4xl font-bold mb-4 text-green-500">₹0</div>
                  <div className="text-sm text-slate-400 space-y-1">
                    <div className="text-green-400">✓ Payment completed during entry</div>
                    <div className="text-green-400">✓ No additional charges</div>
                  </div>
                </div>

                <div className="text-center">
                  <Button 
                    onClick={handleExit}
                    className="bg-green-600 hover:bg-green-700 text-white py-6 px-12 text-xl"
                    size="lg"
                  >
                    <CheckCircle className="mr-3 h-6 w-6" />
                    Exit Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exit;
