import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const WEEKDAYS = [
  { label: 'Mon', value: 'MONDAY' },
  { label: 'Tue', value: 'TUESDAY' },
  { label: 'Wed', value: 'WEDNESDAY' },
  { label: 'Thu', value: 'THURSDAY' },
  { label: 'Fri', value: 'FRIDAY' }
];

const Attendance = () => {
  const [activeTab, setActiveTab] = useState('settings');
  const [hasLab, setHasLab] = useState(false);
  const [selectedLectureDays, setSelectedLectureDays] = useState<string[]>([]);
  const [selectedLabDays, setSelectedLabDays] = useState<string[]>([]);
  const [settings, setSettings] = useState({
    subjectId: '',
    batchId: '',
    lecturesPerWeek: 0,
    labsPerWeek: 0,
    sessionStartDate: '',
    sessionEndDate: ''
  });

  const [attendanceData, setAttendanceData] = useState({
    subjectId: '',
    batchId: '',
    isLab: false,
    date: format(new Date(), 'yyyy-MM-dd'),
    students: [] as Array<{ id: string; name: string; isPresent: boolean; overallPercentage: number }>
  });

  const [batches, setBatches] = useState<any[]>([]);

  useEffect(() => {
    loadAttendanceSchedule();
  }, [settings]);

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      const response = await fetch('/api/fetchAssignedBatches', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load batches');
      }

      const data = await response.json();
      
      if (data.success && Array.isArray(data.batchNames)) {
        setBatches(data.batchNames);
      } else {
        toast.error('Failed to load batches. Invalid data format.');
      }
    } catch (error) {
      console.error('Error loading batches:', error);
      toast.error('Failed to load batches. Invalid data format.');
    }
  };

  const loadAttendanceSchedule = async () => {
    try {
      const response = await fetch('/api/attendanceSettings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...settings,
          hasLabs: hasLab,
          lectureDays: selectedLectureDays,
          labDays: selectedLabDays
        })
      });

      if (!response.ok) throw new Error('Failed to load attendance schedule');
      const data = await response.json();
      setAttendanceData(prev => ({
        ...prev,
        subjectId: settings.subjectId,
        batchId: settings.batchId,
        date: data.schedule[0].date
      }));
      loadStudents(settings.subjectId, settings.batchId);
    } catch (error) {
      console.error('Error loading attendance schedule:', error);
    }
  };

  const loadStudents = async (subjectId: string, batchId: string) => {
    try {
      const response = await fetch(
        `/api/attendance/students?subjectId=${subjectId}&batchId=${batchId}`
      );
      if (!response.ok) throw new Error('Failed to load students');
      const data = await response.json();
      setAttendanceData(prev => ({ ...prev, students: data }));
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const handleDaySelection = (day: string, type: 'lecture' | 'lab') => {
    if (type === 'lecture') {
      setSelectedLectureDays(prev =>
        prev.includes(day)
          ? prev.filter(d => d !== day)
          : [...prev, day]
      );
    } else {
      setSelectedLabDays(prev =>
        prev.includes(day)
          ? prev.filter(d => d !== day)
          : [...prev, day]
      );
    }
  };

  const handleSettingsSave = async () => {
    try {
      const response = await fetch('/api/attendance/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...settings,
          hasLabs: hasLab,
          lectureDays: selectedLectureDays,
          labDays: selectedLabDays
        })
      });

      if (!response.ok) throw new Error('Failed to save settings');
      const data = await response.json();
      console.log('Settings saved:', data);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleAttendanceSave = async () => {
    try {
      const response = await fetch('/api/attendance/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(attendanceData)
      });

      if (!response.ok) throw new Error('Failed to save attendance');
      console.log('Attendance saved successfully');
    } catch (error) {
      console.error('Error saving attendance:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="settings">Attendance Settings</TabsTrigger>
          <TabsTrigger value="marking">Mark Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Configure Attendance Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Select Subject</Label>
                    <Select
                      onValueChange={(value: any) =>
                        setSettings(prev => ({ ...prev, subjectId: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="math1">Mathematics-1</SelectItem>
                        <SelectItem value="math2">Mathematics-2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Select Batch</Label>
                    <Select
                      onValueChange={(value: any) =>
                        setSettings(prev => ({ ...prev, batchId: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose batch" />
                      </SelectTrigger>
                      <SelectContent>
                        {batches.length > 0 ? (
                          batches.map((batchName) => (
                            <SelectItem key={batchName} value={batchName}>
                              {batchName}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-batches">No batches available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Lectures per Week</Label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    onChange={(e) =>
                      setSettings(prev => ({
                        ...prev,
                        lecturesPerWeek: parseInt(e.target.value)
                      }))
                    }
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="lab-switch"
                    checked={hasLab}
                    onCheckedChange={setHasLab}
                  />
                  <Label htmlFor="lab-switch">Has Lab Sessions</Label>
                </div>

                {hasLab && (
                  <div className="space-y-2">
                    <Label>Labs per Week</Label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      onChange={(e) =>
                        setSettings(prev => ({
                          ...prev,
                          labsPerWeek: parseInt(e.target.value)
                        }))
                      }
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Select Lecture Days</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {WEEKDAYS.map((day) => (
                      <Button
                        key={day.value}
                        variant={selectedLectureDays.includes(day.value) ? "default" : "outline"}
                        className="w-full"
                        onClick={() => handleDaySelection(day.value, 'lecture')}
                      >
                        {day.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {hasLab && (
                  <div className="space-y-2">
                    <Label>Select Lab Days</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {WEEKDAYS.map((day) => (
                        <Button
                          key={day.value}
                          variant={selectedLabDays.includes(day.value) ? "default" : "outline"}
                          className="w-full"
                          onClick={() => handleDaySelection(day.value, 'lab')}
                        >
                          {day.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Session Start Date</Label>
                  <Input
                    type="date"
                    onChange={(e) =>
                      setSettings(prev => ({
                        ...prev,
                        sessionStartDate: e.target.value
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Session End Date</Label>
                  <Input
                    type="date"
                    onChange={(e) =>
                      setSettings(prev => ({
                        ...prev,
                        sessionEndDate: e.target.value
                      }))
                    }
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={handleSettingsSave}
                >
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marking">
          <Card>
            <CardHeader>
              <CardTitle>Mark Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Select Subject</Label>
                    <Select
                      onValueChange={(value: string) => {
                        setAttendanceData(prev => ({ ...prev, subjectId: value }));
                        if (attendanceData.batchId) {
                          loadStudents(value, attendanceData.batchId);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="math1">Mathematics-1</SelectItem>
                        <SelectItem value="math2">Mathematics-2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Select Batch</Label>
                    <Select
                      onValueChange={(value: string) => {
                        setAttendanceData(prev => ({ ...prev, batchId: value }));
                        if (attendanceData.subjectId) {
                          loadStudents(attendanceData.subjectId, value);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose batch" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(batches) && batches.length > 0 ? (
                          batches.map((batch) => (
                            <SelectItem key={batch.batchId} value={batch.batchId}>
                              {batch.batchName} - {batch.courseName}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-batches">No batches available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Session Type</Label>
                    <Select
                      onValueChange={(value: string) =>
                        setAttendanceData(prev => ({
                          ...prev,
                          isLab: value === 'lab'
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lecture">Lecture</SelectItem>
                        <SelectItem value="lab">Lab</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={attendanceData.date}
                    onChange={(e) =>
                      setAttendanceData(prev => ({
                        ...prev,
                        date: e.target.value
                      }))
                    }
                  />
                </div>

                <div className="border rounded-md p-4">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Roll No</th>
                        <th className="text-left p-2">Student Name</th>
                        <th className="text-center p-2">Attendance</th>
                        <th className="text-right p-2">Overall %</th>
                        </tr>
                    </thead>
                    <tbody>
                      {attendanceData.students.map((student) => (
                        <tr key={student.id} className="border-b">
                          <td className="p-2">{student.id}</td>
                          <td className="p-2">{student.name}</td>
                          <td className="p-2 text-center">
                            <Switch
                              checked={student.isPresent}
                              onCheckedChange={(checked: boolean) => {
                                setAttendanceData(prev => ({
                                  ...prev,
                                  students: prev.students.map(s =>
                                    s.id === student.id
                                      ? { ...s, isPresent: checked }
                                      : s
                                  )
                                }));
                              }}
                            />
                          </td>
                          <td className="p-2 text-right">{student.overallPercentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Button
                  className="w-full"
                  onClick={handleAttendanceSave}
                >
                  Save Attendance
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Attendance;