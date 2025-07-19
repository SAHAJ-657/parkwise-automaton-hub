
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Camera, Scan, CreditCard, MapPin, Accessibility, Car } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import upiQrCode from "@/assets/upi-qr-code.png";

const Entry = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showDisabilityPrompt, setShowDisabilityPrompt] = useState(false);
  const [disabilityCode, setDisabilityCode] = useState("");
  const [isDisabilityParking, setIsDisabilityParking] = useState(false);
  const [vehicleData, setVehicleData] = useState({
    plateNumber: "",
    isDisability: false,
    isElectric: false,
    assignedSpot: "",
    amount: 40
  });

  // Get available spots from localStorage
  const getAvailableSpots = () => {
    const savedSpots = localStorage.getItem('parkingSpots');
    const spots = savedSpots ? JSON.parse(savedSpots) : [
      { id: 'A-1', name: 'A-1', type: 'regular', occupied: false },
      { id: 'A-2', name: 'A-2', type: 'regular', occupied: false },
      { id: 'D-1', name: 'D-1', type: 'disability', occupied: false },
    ];
    return spots;
  };

  const handlePlateCapture = () => {
    // Show camera not connected popup in bottom right
    toast.error("Camera not connected - enter manually", {
      position: "bottom-right"
    });
  };

  const handleDisabilityResponse = (needsDisability: boolean) => {
    setShowDisabilityPrompt(false);
    if (needsDisability) {
      setIsDisabilityParking(true);
    } else {
      setStep(2);
    }
  };

  const handleDisabilityCodeSubmit = () => {
    if (disabilityCode === "D102030") {
      toast.success("Disability parking approved!");
      setIsDisabilityParking(false);
      setDisabilityCode("");
      handleDisabilityCheck(true);
    } else {
      toast.error("Invalid disability code!");
      setDisabilityCode("");
    }
  };

  const proceedWithSpotAssignment = () => {
    // Check if any spots are available before starting entry process
    const availableSpots = getAvailableSpots();
    const totalAvailable = availableSpots.filter(spot => !spot.occupied).length;
    
    if (totalAvailable === 0) {
      // Show large popup in middle of screen
      toast.error("No parking spots available! Redirecting to dashboard...");
      setTimeout(() => navigate('/'), 3000);
      return;
    }
    
    setStep(2);
  };

  const handleManualEntry = () => {
    if (vehicleData.plateNumber) {
      // Check if any spots are available before proceeding
      const availableSpots = getAvailableSpots();
      const totalAvailable = availableSpots.filter(spot => !spot.occupied).length;
      
      if (totalAvailable === 0) {
        // Show large popup in middle of screen
        toast.error("No parking spots available! Redirecting to dashboard...");
        setTimeout(() => navigate('/'), 3000);
        return;
      }
      
      toast.success("Number plate entered successfully!");
      setStep(2);
    }
  };

  const handleDisabilityCheck = (isDisabled: boolean, isElectric: boolean = false) => {
    const availableSpots = getAvailableSpots();
    let filteredSpots;
    
    if (isElectric) {
      filteredSpots = availableSpots.filter(spot => 
        spot.type === 'electric' && !spot.occupied
      );
      // If no electric spots, allow regular spots
      if (filteredSpots.length === 0) {
        filteredSpots = availableSpots.filter(spot => 
          spot.type === 'regular' && !spot.occupied
        );
      }
    } else if (isDisabled) {
      filteredSpots = availableSpots.filter(spot => 
        spot.type === 'disability' && !spot.occupied
      );
      // If no disability spots, allow regular spots
      if (filteredSpots.length === 0) {
        filteredSpots = availableSpots.filter(spot => 
          spot.type === 'regular' && !spot.occupied
        );
      }
    } else {
      filteredSpots = availableSpots.filter(spot => 
        spot.type === 'regular' && !spot.occupied
      );
    }
    
    if (filteredSpots.length > 0) {
      const randomSpot = filteredSpots[Math.floor(Math.random() * filteredSpots.length)];
      setVehicleData(prev => ({ 
        ...prev, 
        isDisability: isDisabled,
        isElectric: isElectric,
        assignedSpot: randomSpot.id
      }));
      
      // Store the assignment for exit process and update spot occupancy
      localStorage.setItem('currentVehicle', JSON.stringify({
        plateNumber: vehicleData.plateNumber,
        spot: randomSpot.id,
        entryTime: Date.now(),
        amount: 47 // total with tax (40 + 7)
      }));

      // Update spots occupancy
      const updatedSpots = availableSpots.map(spot => 
        spot.id === randomSpot.id ? { ...spot, occupied: true } : spot
      );
      localStorage.setItem('parkingSpots', JSON.stringify(updatedSpots));
      
      setStep(3);
    } else {
      // Only redirect if no spots at all are available
      toast.error("No parking spots available! Redirecting to dashboard...");
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  };

  const handlePayment = () => {
    // Add revenue to total
    const currentRevenue = parseInt(localStorage.getItem('totalRevenue') || '0');
    const newRevenue = currentRevenue + 47;
    localStorage.setItem('totalRevenue', newRevenue.toString());
    
    toast.success("Payment successful! Welcome to ParkWise!");
    setTimeout(() => navigate('/'), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-slate-300 hover:text-white hover:bg-slate-800 absolute left-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-white">Vehicle Entry</h1>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  step >= i ? 'bg-green-600' : 'bg-slate-600'
                }`}>
                  {i}
                </div>
                {i < 3 && <div className={`w-16 h-1 ${step > i ? 'bg-green-600' : 'bg-slate-600'}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Number Plate Scanning */}
        {step === 1 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-6 bg-blue-600/20 rounded-full w-fit">
                <Camera className="h-16 w-16 text-blue-500" />
              </div>
              <CardTitle className="text-2xl text-white">Scan Number Plate</CardTitle>
              <CardDescription className="text-slate-400">
                Position your vehicle so the number plate is clearly visible
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
                  className="bg-blue-600 hover:bg-blue-700 text-white py-6 px-12 text-xl"
                  size="lg"
                >
                  <Camera className="mr-3 h-6 w-6" />
                  Capture Number Plate
                </Button>
              </div>

              {/* Manual Entry Option */}
              <div className="border-t border-slate-600 pt-6">
                <Label htmlFor="manual-plate" className="text-slate-300 text-lg">Manual Entry (if needed)</Label>
                <div className="flex gap-4 mt-2">
                  <Input 
                    id="manual-plate"
                    placeholder="Enter number plate manually"
                    className="bg-slate-900 border-slate-600 text-white"
                    value={vehicleData.plateNumber}
                    onChange={(e) => setVehicleData(prev => ({ ...prev, plateNumber: e.target.value }))}
                  />
                  <Button 
                    onClick={handleManualEntry}
                    disabled={!vehicleData.plateNumber}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-300"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Disability Check */}
        {step === 2 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-6 bg-purple-600/20 rounded-full w-fit">
                <Accessibility className="h-16 w-16 text-purple-500" />
              </div>
              <CardTitle className="text-2xl text-white">Parking Type Selection</CardTitle>
              <CardDescription className="text-slate-400">
                Detected: <span className="text-white font-mono">{vehicleData.plateNumber}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-slate-300 text-lg mb-6">Select your vehicle and parking type:</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-slate-900/50 border-slate-600 cursor-pointer hover:border-purple-500 transition-colors" onClick={() => setIsDisabilityParking(true)}>
                  <CardContent className="p-6 text-center">
                    <Accessibility className="h-10 w-10 text-purple-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-2">Disability Parking</h3>
                    <p className="text-slate-400 text-sm">Reserve a disability parking spot</p>
                    <Button className="mt-3 bg-purple-600 hover:bg-purple-700 w-full text-sm">
                      <Scan className="mr-2 h-4 w-4" />
                      Verify ID
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-600 cursor-pointer hover:border-blue-500 transition-colors" onClick={() => handleDisabilityCheck(false, true)}>
                  <CardContent className="p-6 text-center">
                    <Car className="h-10 w-10 text-blue-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-2">Electric Vehicle</h3>
                    <p className="text-slate-400 text-sm">Charging station parking</p>
                    <Button className="mt-3 bg-blue-600 hover:bg-blue-700 w-full text-sm">
                      Book Electric Spot
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-600 cursor-pointer hover:border-green-500 transition-colors" onClick={() => handleDisabilityCheck(false, false)}>
                  <CardContent className="p-6 text-center">
                    <MapPin className="h-10 w-10 text-green-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-2">Regular Parking</h3>
                    <p className="text-slate-400 text-sm">Standard parking spot</p>
                    <Button className="mt-3 bg-green-600 hover:bg-green-700 w-full text-sm">
                      Continue
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-6 bg-green-600/20 rounded-full w-fit">
                <CreditCard className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-white">Payment & Spot Assignment</CardTitle>
              <CardDescription className="text-slate-400">
                Complete payment to confirm your parking reservation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Spot Assignment */}
              <div className="bg-slate-900/50 p-6 rounded-lg">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-4">Your Assigned Spot</h3>
                  <div className={`text-6xl font-bold mb-2 ${vehicleData.isDisability ? 'text-purple-500' : 'text-green-500'}`}>
                    {vehicleData.assignedSpot}
                  </div>
                  <p className="text-slate-400">
                    {vehicleData.isElectric ? 'Electric Vehicle Spot' : vehicleData.isDisability ? 'Disability Parking Spot' : 'Regular Parking Spot'}
                  </p>
                </div>
              </div>

              {/* UPI QR Code */}
              <div className="bg-slate-900/50 p-6 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-white mb-4">Scan to Pay with UPI</h3>
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-8 rounded-lg w-48 h-48 flex items-center justify-center">
                    <p className="text-slate-800 text-center font-semibold">UPI QR code for payment</p>
                  </div>
                </div>
                <p className="text-lg font-semibold text-purple-400 mb-2">ParkWise Payment</p>
                <p className="text-slate-400 text-sm">Scan with PhonePe, GooglePay, Paytm or any UPI app</p>
              </div>

              {/* Payment Details */}
              <div className="bg-slate-900/50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Payment Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span>Base Rate (4 hours)</span>
                    <span>₹{vehicleData.amount}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Overtime (₹12/hr)</span>
                    <span>₹0</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>GST (18%)</span>
                    <span>₹{Math.round(vehicleData.amount * 0.18)}</span>
                  </div>
                  <div className="border-t border-slate-600 pt-2">
                    <div className="flex justify-between text-white font-semibold text-lg">
                      <span>Total Amount</span>
                      <span>₹{vehicleData.amount + Math.round(vehicleData.amount * 0.18)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <div className="text-center">
                <Button 
                  onClick={handlePayment}
                  className="bg-green-600 hover:bg-green-700 text-white py-6 px-12 text-xl"
                  size="lg"
                >
                  <CreditCard className="mr-3 h-6 w-6" />
                  Complete Payment ₹{vehicleData.amount + Math.round(vehicleData.amount * 0.18)}
                </Button>
                <p className="text-slate-400 text-sm mt-2">Supports all major UPI apps</p>
              </div>
            </CardContent>
          </Card>
        )}


        {/* Disability Code Input */}
        {isDisabilityParking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-slate-800/90 border-slate-700 max-w-md mx-4">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-6 bg-purple-600/20 rounded-full w-fit">
                  <Scan className="h-16 w-16 text-purple-500" />
                </div>
                <CardTitle className="text-xl text-white">Disability Verification</CardTitle>
                <CardDescription className="text-slate-400">
                  Card scanner not connected - enter verification code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="disability-code" className="text-slate-300">Verification Code</Label>
                  <Input
                    id="disability-code"
                    type="password"
                    placeholder="••••••"
                    className="bg-slate-900 border-slate-600 text-white"
                    value={disabilityCode}
                    onChange={(e) => setDisabilityCode(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleDisabilityCodeSubmit()}
                  />
                </div>
                <div className="flex gap-4">
                  <Button 
                    onClick={handleDisabilityCodeSubmit}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Scan className="h-4 w-4 mr-2" />
                    Verify
                  </Button>
                  <Button 
                    onClick={() => {
                      setIsDisabilityParking(false);
                      setDisabilityCode("");
                    }}
                    variant="outline"
                    className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
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

export default Entry;
