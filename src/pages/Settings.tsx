import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, DollarSign, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface RateSettings {
  baseHourlyRate: number;
  overtimeHourlyRate: number;
  updatedAt: string;
}

const DEFAULT_RATES: RateSettings = {
  baseHourlyRate: 40,
  overtimeHourlyRate: 60,
  updatedAt: new Date().toISOString()
};

const Settings = () => {
  const navigate = useNavigate();
  const [rates, setRates] = useState<RateSettings>(DEFAULT_RATES);
  const [tempRates, setTempRates] = useState({ base: "40", overtime: "60" });

  useEffect(() => {
    const savedRates = localStorage.getItem('rateSettings');
    if (savedRates) {
      const parsed = JSON.parse(savedRates);
      setRates(parsed);
      setTempRates({
        base: parsed.baseHourlyRate.toString(),
        overtime: parsed.overtimeHourlyRate.toString()
      });
    }
  }, []);

  const handleSave = () => {
    const baseRate = parseFloat(tempRates.base);
    const overtimeRate = parseFloat(tempRates.overtime);

    if (isNaN(baseRate) || isNaN(overtimeRate)) {
      toast.error("Please enter valid numeric values");
      return;
    }

    if (baseRate < 0 || overtimeRate < 0) {
      toast.error("Rates must be non-negative");
      return;
    }

    const newRates: RateSettings = {
      baseHourlyRate: Math.round(baseRate * 100) / 100,
      overtimeHourlyRate: Math.round(overtimeRate * 100) / 100,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem('rateSettings', JSON.stringify(newRates));
    setRates(newRates);
    toast.success("Rate settings saved successfully!");
  };

  const handleResetToDefaults = () => {
    localStorage.setItem('rateSettings', JSON.stringify(DEFAULT_RATES));
    setRates(DEFAULT_RATES);
    setTempRates({
      base: DEFAULT_RATES.baseHourlyRate.toString(),
      overtime: DEFAULT_RATES.overtimeHourlyRate.toString()
    });
    toast.success("Reset to default rates!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin')}
            className="text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Admin
          </Button>
          <h1 className="text-3xl font-bold text-white">Rate Settings</h1>
        </div>

        {/* Current Rates Display */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Current Active Rates</CardTitle>
            <CardDescription className="text-slate-400">
              Last updated: {new Date(rates.updatedAt).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <span className="text-slate-400">Base Hourly Rate</span>
                </div>
                <div className="text-3xl font-bold text-green-500">₹{rates.baseHourlyRate}/hr</div>
                <p className="text-slate-500 text-sm mt-1">Applied within plan hours</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-orange-500" />
                  <span className="text-slate-400">Overtime Hourly Rate</span>
                </div>
                <div className="text-3xl font-bold text-orange-500">₹{rates.overtimeHourlyRate}/hr</div>
                <p className="text-slate-500 text-sm mt-1">Applied after plan hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rate Configuration */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Configure Rates</CardTitle>
            <CardDescription className="text-slate-400">
              Set hourly rates for base time and overtime charges
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="baseRate" className="text-slate-300">
                  Base Hourly Rate (₹/hour)
                </Label>
                <Input
                  id="baseRate"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="40.00"
                  className="bg-slate-900 border-slate-600 text-white"
                  value={tempRates.base}
                  onChange={(e) => setTempRates({ ...tempRates, base: e.target.value })}
                />
                <p className="text-slate-500 text-sm">
                  Charged for hours within the selected plan (4h or 8h)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="overtimeRate" className="text-slate-300">
                  Overtime Hourly Rate (₹/hour)
                </Label>
                <Input
                  id="overtimeRate"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="60.00"
                  className="bg-slate-900 border-slate-600 text-white"
                  value={tempRates.overtime}
                  onChange={(e) => setTempRates({ ...tempRates, overtime: e.target.value })}
                />
                <p className="text-slate-500 text-sm">
                  Charged for hours exceeding the selected plan
                </p>
              </div>
            </div>

            {/* Example Calculations */}
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <h4 className="text-white font-semibold mb-3">Example Calculations</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>3.5h stay on 4h plan:</span>
                  <span className="text-green-400">
                    ₹{(3.5 * parseFloat(tempRates.base || "0")).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>5.25h stay on 4h plan:</span>
                  <span className="text-orange-400">
                    ₹{((4 * parseFloat(tempRates.base || "0")) + (1.25 * parseFloat(tempRates.overtime || "0"))).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>8.25h stay on 8h plan:</span>
                  <span className="text-orange-400">
                    ₹{((8 * parseFloat(tempRates.base || "0")) + (0.25 * parseFloat(tempRates.overtime || "0"))).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
              <Button 
                onClick={handleResetToDefaults}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
