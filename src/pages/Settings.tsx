import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Settings as SettingsIcon, Save, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ParkingSettings {
  baseHourlyRate: number;
  overtimeHourlyRate: number;
  updatedAt: string;
}

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<ParkingSettings>({
    baseHourlyRate: 40,
    overtimeHourlyRate: 60,
    updatedAt: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('parkingSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = () => {
    // Validate input
    if (settings.baseHourlyRate < 0 || settings.overtimeHourlyRate < 0) {
      toast.error("Rates must be greater than or equal to 0");
      return;
    }

    if (isNaN(settings.baseHourlyRate) || isNaN(settings.overtimeHourlyRate)) {
      toast.error("Please enter valid numeric values");
      return;
    }

    setIsLoading(true);
    const updatedSettings = {
      ...settings,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem('parkingSettings', JSON.stringify(updatedSettings));
    setSettings(updatedSettings);
    
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Settings saved successfully!");
    }, 500);
  };

  const handleResetToDefaults = () => {
    const defaultSettings = {
      baseHourlyRate: 40,
      overtimeHourlyRate: 60,
      updatedAt: new Date().toISOString()
    };
    setSettings(defaultSettings);
    toast.success("Settings reset to defaults");
  };

  const handleInputChange = (field: keyof ParkingSettings, value: string) => {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) || value === '') {
      setSettings(prev => ({
        ...prev,
        [field]: value === '' ? 0 : Math.round(numericValue * 100) / 100 // Round to 2 decimal places
      }));
    }
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
          <h1 className="text-3xl font-bold text-white">Parking Rate Settings</h1>
        </div>

        <div className="space-y-6">
          {/* Current Settings Overview */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center gap-2">
                <SettingsIcon className="h-6 w-6 text-blue-500" />
                <CardTitle className="text-white">Rate Configuration</CardTitle>
              </div>
              <CardDescription className="text-slate-400">
                Configure hourly rates for parking plans
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="baseRate" className="text-slate-300 text-lg">
                    Base Hourly Rate (₹/hour)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">₹</span>
                    <Input
                      id="baseRate"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="40.00"
                      className="bg-slate-900 border-slate-600 text-white pl-8 text-lg"
                      value={settings.baseHourlyRate}
                      onChange={(e) => handleInputChange('baseHourlyRate', e.target.value)}
                    />
                  </div>
                  <p className="text-slate-500 text-sm">
                    Rate charged for hours within the selected plan (4h or 8h)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="overtimeRate" className="text-slate-300 text-lg">
                    Overtime Hourly Rate (₹/hour)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">₹</span>
                    <Input
                      id="overtimeRate"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="60.00"
                      className="bg-slate-900 border-slate-600 text-white pl-8 text-lg"
                      value={settings.overtimeHourlyRate}
                      onChange={(e) => handleInputChange('overtimeHourlyRate', e.target.value)}
                    />
                  </div>
                  <p className="text-slate-500 text-sm">
                    Rate charged for hours exceeding the selected plan
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Settings'}
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

          {/* Pricing Examples */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Pricing Examples</CardTitle>
              <CardDescription className="text-slate-400">
                Examples of how fees are calculated with current rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-400">4-Hour Plan Examples</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-slate-300">
                      <span>3.5h stay:</span>
                      <span>₹{(3.5 * settings.baseHourlyRate).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>4h stay (exactly):</span>
                      <span>₹{(4 * settings.baseHourlyRate).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>5.25h stay:</span>
                      <span>₹{((4 * settings.baseHourlyRate) + (1.25 * settings.overtimeHourlyRate)).toFixed(0)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400">8-Hour Plan Examples</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-slate-300">
                      <span>7.5h stay:</span>
                      <span>₹{(7.5 * settings.baseHourlyRate).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>8h stay (exactly):</span>
                      <span>₹{(8 * settings.baseHourlyRate).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>8.25h stay:</span>
                      <span>₹{((8 * settings.baseHourlyRate) + (0.25 * settings.overtimeHourlyRate)).toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rate Info */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Rate Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <h4 className="text-slate-400 text-sm">Duration Rounding</h4>
                  <p className="text-white font-semibold">15-minute intervals</p>
                  <p className="text-slate-500 text-xs mt-1">e.g., 2h10m → 2.25h</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <h4 className="text-slate-400 text-sm">Default Plan</h4>
                  <p className="text-white font-semibold">4 hours</p>
                  <p className="text-slate-500 text-xs mt-1">If no plan selected</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <h4 className="text-slate-400 text-sm">Last Updated</h4>
                  <p className="text-white font-semibold">
                    {new Date(settings.updatedAt).toLocaleDateString()}
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    {new Date(settings.updatedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;