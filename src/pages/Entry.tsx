
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Camera, Scan, CreditCard, MapPin, Accessibility } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Entry = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [vehicleData, setVehicleData] = useState({
    plateNumber: "",
    isDisability: false,
    assignedSpot: "",
    amount: 50
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
    // Simulate plate capture
    const simulatedPlate = "MH12AB" + Math.floor(Math.random() * 9999);
    setVehicleData(prev => ({ ...prev, plateNumber: simulatedPlate }));
    toast.success("Number plate captured successfully!");
    setStep(2);
  };

  const handleManualEntry = () => {
    if (vehicleData.plateNumber) {
      toast.success("Number plate entered successfully!");
      setStep(2);
    }
  };

  const handleDisabilityCheck = (isDisabled: boolean) => {
    const availableSpots = getAvailableSpots();
    const filteredSpots = availableSpots.filter(spot => 
      isDisabled ? spot.type === 'disability' && !spot.occupied : spot.type === 'regular' && !spot.occupied
    );
    
    if (filteredSpots.length > 0) {
      const randomSpot = filteredSpots[Math.floor(Math.random() * filteredSpots.length)];
      setVehicleData(prev => ({ 
        ...prev, 
        isDisability: isDisabled,
        assignedSpot: randomSpot.id
      }));
      
      // Store the assignment for exit process and update spot occupancy
      localStorage.setItem('currentVehicle', JSON.stringify({
        plateNumber: vehicleData.plateNumber,
        spot: randomSpot.id,
        entryTime: Date.now()
      }));

      // Update spots occupancy
      const updatedSpots = availableSpots.map(spot => 
        spot.id === randomSpot.id ? { ...spot, occupied: true } : spot
      );
      localStorage.setItem('parkingSpots', JSON.stringify(updatedSpots));
      
      setStep(3);
    } else {
      toast.error(`No ${isDisabled ? 'disability' : 'regular'} parking spots available!`);
    }
  };

  const handlePayment = () => {
    toast.success("Payment successful! Welcome to ParkWise!");
    setTimeout(() => navigate('/'), 2000);
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
                <p className="text-slate-500 text-sm mt-2">Webcam integration ready</p>
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
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-600"
                    variant="outline"
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
                <p className="text-slate-300 text-lg mb-6">Select your parking type:</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-slate-900/50 border-slate-600 cursor-pointer hover:border-purple-500 transition-colors" onClick={() => handleDisabilityCheck(true)}>
                  <CardContent className="p-8 text-center">
                    <Accessibility className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Disability Parking</h3>
                    <p className="text-slate-400">Reserve a disability parking spot</p>
                    <Button className="mt-4 bg-purple-600 hover:bg-purple-700 w-full">
                      <Scan className="mr-2 h-5 w-5" />
                      Scan Disability ID
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-600 cursor-pointer hover:border-green-500 transition-colors" onClick={() => handleDisabilityCheck(false)}>
                  <CardContent className="p-8 text-center">
                    <MapPin className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Regular parking</h3>
                    <p className="text-slate-400">Assign any available parking spot</p>
                    <Button className="mt-4 bg-green-600 hover:bg-green-700 w-full">
                      Continue to Payment
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
                    {vehicleData.isDisability ? 'Disability Parking Spot' : 'Regular Parking Spot'}
                  </p>
                </div>
              </div>

              {/* UPI QR Code */}
              <div className="bg-slate-900/50 p-6 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-white mb-4">Scan to Pay with UPI</h3>
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-4 rounded-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=200&h=200&fit=crop&crop=center" 
                      alt="UPI QR Code for Payment" 
                      className="w-48 h-48 object-cover"
                    />
                  </div>
                </div>
                <p className="text-lg font-semibold text-purple-400 mb-2">Nashik-1</p>
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
      </div>
    </div>
  );
};

export default Entry;
