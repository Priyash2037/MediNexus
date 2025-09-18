import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Video, MessageSquare, FileText, User, Calendar as CalendarIcon, Upload } from "lucide-react";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const userType = localStorage.getItem("userType");
    
    if (!isAuthenticated || userType !== "patient") {
      navigate("/patient-login");
    }
  }, [navigate]);
  
  // Mock data for appointments
  const upcomingAppointments = [
    {
      id: 1,
      doctorName: "Dr. Sharma",
      specialization: "Cardiologist",
      date: "2023-11-15",
      time: "10:00 AM",
      status: "confirmed"
    },
    {
      id: 2,
      doctorName: "Dr. Patel",
      specialization: "General Physician",
      date: "2023-11-20",
      time: "2:30 PM",
      status: "pending"
    }
  ];
  
  // Mock data for medical records
  const medicalRecords = [
    {
      id: 1,
      title: "Blood Test Results",
      date: "2023-10-05",
      doctor: "Dr. Sharma",
      type: "Lab Report"
    },
    {
      id: 2,
      title: "Prescription",
      date: "2023-10-10",
      doctor: "Dr. Patel",
      type: "Medication"
    },
    {
      id: 3,
      title: "X-Ray Report",
      date: "2023-09-15",
      doctor: "Dr. Singh",
      type: "Radiology"
    }
  ];

  const handleStartChat = () => {
    navigate("/chatbot");
  };

  const handleStartCall = () => {
    navigate("/video-call");
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Patient Dashboard</h1>
            <p className="text-muted-foreground">Manage your healthcare journey</p>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={handleStartChat} className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat with AI
            </Button>
            <Button onClick={handleStartCall} variant="healthcare" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Start Video Call
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Profile */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl">RS</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold">Rahul Singh</h3>
              <p className="text-muted-foreground">Patient ID: P12345</p>
              <div className="w-full mt-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age:</span>
                  <span>42 years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Blood Group:</span>
                  <span>O+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address:</span>
                  <span>Amritsar, Punjab</span>
                </div>
              </div>
              <Button variant="outline" className="mt-6 w-full">
                <User className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </CardContent>
          </Card>
          
          {/* Right Column - Tabs */}
          <Card className="md:col-span-2">
            <Tabs defaultValue="appointments">
              <CardHeader>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="appointments">Appointments</TabsTrigger>
                  <TabsTrigger value="records">Medical Records</TabsTrigger>
                  <TabsTrigger value="book">Book Appointment</TabsTrigger>
                </TabsList>
              </CardHeader>
              
              <TabsContent value="appointments">
                <CardContent>
                  <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarFallback>{appointment.doctorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold">{appointment.doctorName}</h4>
                              <p className="text-sm text-muted-foreground">{appointment.specialization}</p>
                              <p className="text-sm">{appointment.date} at {appointment.time}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant={appointment.status === 'confirmed' ? 'default' : 'outline'}>
                              {appointment.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                            </Badge>
                            {appointment.status === 'confirmed' && (
                              <Button size="sm" variant="outline" className="flex items-center gap-1">
                                <Video className="h-3 w-3" /> Join
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No upcoming appointments</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View All Appointments</Button>
                </CardFooter>
              </TabsContent>
              
              <TabsContent value="records">
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Medical Records</h3>
                    <Button size="sm" className="flex items-center gap-1">
                      <Upload className="h-3 w-3" /> Upload
                    </Button>
                  </div>
                  {medicalRecords.length > 0 ? (
                    <div className="space-y-4">
                      {medicalRecords.map((record) => (
                        <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-semibold">{record.title}</h4>
                            <p className="text-sm text-muted-foreground">By {record.doctor}</p>
                            <p className="text-sm">{record.date}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{record.type}</Badge>
                            <Button size="sm" variant="outline">View</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No medical records found</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View All Records</Button>
                </CardFooter>
              </TabsContent>
              
              <TabsContent value="book">
                <CardContent>
                  <h3 className="text-lg font-semibold mb-4">Book New Appointment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Select Date</h4>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="border rounded-md"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Available Doctors</h4>
                      <div className="space-y-3">
                        <div className="p-3 border rounded-lg cursor-pointer hover:bg-accent">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>DS</AvatarFallback>
                            </Avatar>
                            <div>
                              <h5 className="font-semibold">Dr. Sharma</h5>
                              <p className="text-sm text-muted-foreground">Cardiologist</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 border rounded-lg cursor-pointer hover:bg-accent">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>DP</AvatarFallback>
                            </Avatar>
                            <div>
                              <h5 className="font-semibold">Dr. Patel</h5>
                              <p className="text-sm text-muted-foreground">General Physician</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 border rounded-lg cursor-pointer hover:bg-accent">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>DS</AvatarFallback>
                            </Avatar>
                            <div>
                              <h5 className="font-semibold">Dr. Singh</h5>
                              <p className="text-sm text-muted-foreground">Neurologist</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="healthcare">Book Appointment</Button>
                </CardFooter>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </Layout>
  );
}