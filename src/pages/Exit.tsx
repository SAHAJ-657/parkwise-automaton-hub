
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
    let entryTime, spot, planHours, baseRate, overtimeRate;
    
    if (storedVehicle) {
      const vehicleData = JSON.parse(storedVehicle);
      entryTime = new Date(vehicleData.entryTime);
      spot = vehicleData.spot;
      planHours = vehicleData.planHours || 4;
      baseRate = vehicleData.baseRateSnapshot || 40;
      overtimeRate = vehicleData.overtimeRateSnapshot || 60;
    } else {
      // Vehicle not found - allow exit
      toast.success("Vehicle not found - Exit granted!");
      setTimeout(() => navigate('/'), 2000);
      return;
    }
    
    const exitTime = new Date();
    const durationMs = exitTime.getTime() - entryTime.getTime();
    
    // Round to nearest 15 minutes
    const quarterHours = Math.ceil(durationMs / (15 * 60 * 1000));
    const durationHours = quarterHours * 0.25;
    
    // Calculate fees
    let baseAmount = 0;
    let overtimeFee = 0;
    let additionalPayment = 0;
    
    if (durationHours <= planHours) {
      // Within plan hours - no additional charge
      baseAmount = durationHours * baseRate;
      overtimeFee = 0;
      additionalPayment = 0;
    } else {
      // Exceeded plan hours
      const overtimeHours = durationHours - planHours;
      baseAmount = planHours * baseRate;
      overtimeFee = overtimeHours * overtimeRate;
      additionalPayment = overtimeFee;
    }

    setExitData({
      plateNumber: plateToUse,
      entryTime: entryTime.toLocaleString(),
      exitTime: exitTime.toLocaleString(),
      duration: durationHours,
      baseAmount: Math.round(baseAmount * 100) / 100,
      overtimeFee: Math.round(overtimeFee * 100) / 100,
      totalAmount: Math.round(additionalPayment * 100) / 100,
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
    // Add overtime revenue if applicable
    if (exitData.totalAmount > 0) {
      const currentRevenue = parseInt(localStorage.getItem('totalRevenue') || '0');
      const newRevenue = currentRevenue + exitData.totalAmount;
      localStorage.setItem('totalRevenue', newRevenue.toString());
    }
    
    // Update spot occupancy and clear stored vehicle data
    const savedSpots = localStorage.getItem('parkingSpots');
    if (savedSpots) {
      const spots = JSON.parse(savedSpots);
      const updatedSpots = spots.map(spot => 
        spot.id === exitData.spot ? { ...spot, occupied: false, plateNumber: '' } : spot
      );
      localStorage.setItem('parkingSpots', JSON.stringify(updatedSpots));
    }
    
    // Remove vehicle from parkedVehicles array
    const savedVehicles = localStorage.getItem('parkedVehicles');
    if (savedVehicles) {
      const vehicles = JSON.parse(savedVehicles);
      const updatedVehicles = vehicles.filter(v => v.plateNumber !== exitData.plateNumber);
      localStorage.setItem('parkedVehicles', JSON.stringify(updatedVehicles));
    }
    
    localStorage.removeItem('currentVehicle');
    
    if (exitData.totalAmount > 0) {
      toast.success(`Additional payment of ₹${exitData.totalAmount} collected!`);
    }
    
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
                      <span className="text-slate-400">Base Hours Billed:</span>
                      <span className="text-white font-semibold">
                        {exitData.duration <= exitData.baseAmount / 40 ? exitData.duration.toFixed(2) : (exitData.baseAmount / 40).toFixed(2)}h
                      </span>
                    </div>
                    {exitData.overtimeFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Overtime Hours:</span>
                        <span className="text-orange-400 font-semibold">
                          {(exitData.duration - (exitData.baseAmount / 40)).toFixed(2)}h
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <span className={`font-semibold ${exitData.totalAmount > 0 ? 'text-orange-400' : 'text-green-400'}`}>
                        {exitData.totalAmount > 0 ? 'OVERTIME' : 'PAID'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Additional Due:</span>
                      <span className={`font-semibold ${exitData.totalAmount > 0 ? 'text-orange-400' : 'text-green-400'}`}>
                        ₹{exitData.totalAmount}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exit Section */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="text-center">
                <div className={`mx-auto mb-4 p-6 rounded-full w-fit ${
                  exitData.totalAmount > 0 ? 'bg-orange-600/20' : 'bg-green-600/20'
                }`}>
                  {exitData.totalAmount > 0 ? (
                    <AlertTriangle className="h-16 w-16 text-orange-500" />
                  ) : (
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  )}
                </div>
                <CardTitle className="text-2xl text-white">
                  {exitData.totalAmount > 0 ? 'Overtime Payment Required' : 'Ready to Exit'}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {exitData.totalAmount > 0 
                    ? 'Additional payment required for overtime hours' 
                    : 'Payment completed. You can exit now.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-slate-900/50 p-6 rounded-lg">
                  <h3 className="text-lg text-slate-400 mb-4 text-center">Payment Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-slate-300">
                      <span>Base Amount (Paid):</span>
                      <span className="text-green-400">₹{exitData.baseAmount}</span>
                    </div>
                    {exitData.overtimeFee > 0 && (
                      <div className="flex justify-between text-slate-300">
                        <span>Overtime Charges:</span>
                        <span className="text-orange-400">₹{exitData.overtimeFee}</span>
                      </div>
                    )}
                    <div className="border-t border-slate-600 pt-2">
                      <div className="flex justify-between text-white font-semibold text-lg">
                        <span>Additional Payment:</span>
                        <span className={exitData.totalAmount > 0 ? 'text-orange-400' : 'text-green-400'}>
                          ₹{exitData.totalAmount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button 
                    onClick={handleExit}
                    className={`py-6 px-12 text-xl ${
                      exitData.totalAmount > 0 
                        ? 'bg-orange-600 hover:bg-orange-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white`}
                    size="lg"
                  >
                    <CheckCircle className="mr-3 h-6 w-6" />
                    {exitData.totalAmount > 0 ? `Pay ₹${exitData.totalAmount} & Exit` : 'Exit Now'}
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
