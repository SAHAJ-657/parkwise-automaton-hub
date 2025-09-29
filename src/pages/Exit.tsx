
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Camera, Clock, CreditCard, CheckCircle, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Fee calculation utility function
const calculateParkingFee = (
  entryTime: number,
  exitTime: number,
  planHours: number,
  baseRate: number,
  overtimeRate: number
) => {
  const durationMs = exitTime - entryTime;
  const quarterHours = Math.ceil(durationMs / (15 * 60 * 1000)); // Round up to nearest 15 minutes
  const durationHours = quarterHours * 0.25;
  
  let baseBilled = 0;
  let overtimeBilled = 0;
  let total = 0;
  
  if (durationHours <= planHours) {
    baseBilled = durationHours;
    total = durationHours * baseRate;
  } else {
    baseBilled = planHours;
    overtimeBilled = durationHours - planHours;
    total = (planHours * baseRate) + (overtimeBilled * overtimeRate);
  }
  
  return {
    durationHours: Math.round(durationHours * 100) / 100, // Round to 2 decimal places
    baseBilled: Math.round(baseBilled * 100) / 100,
    overtimeBilled: Math.round(overtimeBilled * 100) / 100,
    total: Math.round(total)
  };
};

const Exit = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [manualPlate, setManualPlate] = useState("");
  const [exitData, setExitData] = useState({
    plateNumber: "",
    entryTime: "",
    exitTime: "",
    duration: 0,
    planHours: 4,
    baseRateSnapshot: 40,
    overtimeRateSnapshot: 60,
    baseBilled: 0,
    overtimeBilled: 0,
    paidAmount: 0,
    additionalAmount: 0,
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
    let vehicleData;
    
    if (storedVehicle) {
      vehicleData = JSON.parse(storedVehicle);
    } else {
      // Vehicle not found - allow exit
      toast.success("Vehicle not found - Exit granted!");
      setTimeout(() => navigate('/'), 2000);
      return;
    }
    
    const entryTime = vehicleData.entryTime;
    const exitTime = Date.now();
    
    // Calculate fees using the enhanced calculation
    const feeCalculation = calculateParkingFee(
      entryTime,
      exitTime,
      vehicleData.planHours || 4,
      vehicleData.baseRateSnapshot || 40,
      vehicleData.overtimeRateSnapshot || 60
    );
    
    const paidAmount = vehicleData.amount || 0;
    const additionalAmount = Math.max(0, feeCalculation.total - paidAmount);

    setExitData({
      plateNumber: plateToUse,
      entryTime: new Date(entryTime).toLocaleString(),
      exitTime: new Date(exitTime).toLocaleString(),
      duration: feeCalculation.durationHours,
      planHours: vehicleData.planHours || 4,
      baseRateSnapshot: vehicleData.baseRateSnapshot || 40,
      overtimeRateSnapshot: vehicleData.overtimeRateSnapshot || 60,
      baseBilled: feeCalculation.baseBilled,
      overtimeBilled: feeCalculation.overtimeBilled,
      paidAmount,
      additionalAmount,
      totalAmount: feeCalculation.total,
      spot: vehicleData.spot
    });

    if (additionalAmount > 0) {
      toast.success("Vehicle found! Additional payment required.");
    } else {
      toast.success("Vehicle found! No additional payment required.");
    }
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
        spot.id === exitData.spot ? { ...spot, occupied: false, plateNumber: '' } : spot
      );
      localStorage.setItem('parkingSpots', JSON.stringify(updatedSpots));
    }
    
    // Remove vehicle from parkedVehicles array and add to complete history
    const savedVehicles = localStorage.getItem('parkedVehicles');
    if (savedVehicles) {
      const vehicles = JSON.parse(savedVehicles);
      const exitingVehicle = vehicles.find(v => v.plateNumber === exitData.plateNumber);
      const updatedVehicles = vehicles.filter(v => v.plateNumber !== exitData.plateNumber);
      localStorage.setItem('parkedVehicles', JSON.stringify(updatedVehicles));
      
      // Update parking history with exit details
      if (exitingVehicle) {
        const savedHistory = localStorage.getItem('parkingHistory');
        const history = savedHistory ? JSON.parse(savedHistory) : [];
        const updatedHistory = history.map(h => 
          h.plateNumber === exitData.plateNumber && h.entryTime === exitingVehicle.entryTime
            ? { 
                ...h, 
                exitTime: Date.now(),
                duration: exitData.duration,
                totalAmount: exitData.totalAmount,
                baseBilled: exitData.baseBilled,
                overtimeBilled: exitData.overtimeBilled
              }
            : h
        );
        localStorage.setItem('parkingHistory', JSON.stringify(updatedHistory));
      }
    }
    
    // Add additional revenue if any
    if (exitData.additionalAmount > 0) {
      const currentRevenue = parseInt(localStorage.getItem('totalRevenue') || '0');
      const newRevenue = currentRevenue + exitData.additionalAmount;
      localStorage.setItem('totalRevenue', newRevenue.toString());
    }
    
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
                      <span className="text-slate-400">Plan:</span>
                      <span className="text-white font-semibold">{exitData.planHours}h plan</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Base Hours:</span>
                      <span className="text-white font-semibold">{exitData.baseBilled}h @ ₹{exitData.baseRateSnapshot}/h</span>
                    </div>
                    {exitData.overtimeBilled > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Overtime:</span>
                        <span className="text-orange-400 font-semibold">{exitData.overtimeBilled}h @ ₹{exitData.overtimeRateSnapshot}/h</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-400">Already Paid:</span>
                      <span className="text-green-400 font-semibold">₹{exitData.paidAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Additional Due:</span>
                      <span className={`font-semibold ${exitData.additionalAmount > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        ₹{exitData.additionalAmount}
                      </span>
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
                  {exitData.additionalAmount === 0 
                    ? "No additional payment required. You can exit now."
                    : "Additional payment required before exit."
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-slate-900/50 p-6 rounded-lg text-center">
                  <h3 className="text-lg text-slate-400 mb-2">Additional Amount Due</h3>
                  <div className={`text-4xl font-bold mb-4 ${exitData.additionalAmount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    ₹{exitData.additionalAmount}
                  </div>
                  <div className="text-sm text-slate-400 space-y-1">
                    <div className="text-blue-400">Total Calculated: ₹{exitData.totalAmount}</div>
                    <div className="text-green-400">Already Paid: ₹{exitData.paidAmount}</div>
                    {exitData.additionalAmount === 0 && (
                      <div className="text-green-400">✓ No additional charges</div>
                    )}
                    {exitData.additionalAmount > 0 && (
                      <div className="text-red-400">⚠ Additional payment required</div>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  {exitData.additionalAmount === 0 ? (
                    <Button 
                      onClick={handleExit}
                      className="bg-green-600 hover:bg-green-700 text-white py-6 px-12 text-xl"
                      size="lg"
                    >
                      <CheckCircle className="mr-3 h-6 w-6" />
                      Exit Now
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <Button 
                        onClick={() => {
                          // Add additional payment to revenue and then exit
                          const currentRevenue = parseInt(localStorage.getItem('totalRevenue') || '0');
                          const newRevenue = currentRevenue + exitData.additionalAmount;
                          localStorage.setItem('totalRevenue', newRevenue.toString());
                          toast.success(`Additional payment of ₹${exitData.additionalAmount} received!`);
                          handleExit();
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-6 px-12 text-xl"
                        size="lg"
                      >
                        <CreditCard className="mr-3 h-6 w-6" />
                        Pay ₹{exitData.additionalAmount} & Exit
                      </Button>
                      <p className="text-slate-400 text-sm">Additional payment required for overtime parking</p>
                    </div>
                  )}
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
