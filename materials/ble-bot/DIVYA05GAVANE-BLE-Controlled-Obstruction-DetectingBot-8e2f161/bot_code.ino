#include <SoftwareSerial.h>
//#include <Servo.h>
//#include <NewPing.h>

/*#define TRIGGER_PIN  2  // Arduino pin tied to trigger pin on the ultrasonic sensor.
#define ECHO_PIN     3  // Arduino pin tied to echo pin on the ultrasonic sensor.
#define MAX_DISTANCE 200*/
int pos = 0;
//Servo servo; 
char value = ' ';
const int trigPin = 2;
const int echoPin = 3;
long duration;
int distance;
SoftwareSerial serial(7,8);
//NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE); // NewPing setup of pins and maximum distance.

void setup() 
{
//servo.attach(9);  
pinMode(trigPin, OUTPUT); 
pinMode(echoPin, INPUT); 

serial.begin(9600);
pinMode(5,OUTPUT);
pinMode(6,OUTPUT);
pinMode(10,OUTPUT);
pinMode(11,OUTPUT); 

}

void loop()
{
/*for (pos = 0; pos <= 180; pos += 1)
{
servo.write(pos); 
delay(15);
}
for (pos = 180; pos >= 0; pos -= 1)
{
servo.write(pos);
delay(15);   
}*/
digitalWrite(trigPin, LOW);
delayMicroseconds(2);

digitalWrite(trigPin, HIGH);
delayMicroseconds(10);
digitalWrite(trigPin, LOW);

duration = pulseIn(echoPin, HIGH);

distance= duration*0.034/2;

serial.print("Distance: ");
serial.println(distance);

  /*delay(50);                     // Wait 50ms between pings (about 20 pings/sec). 29ms should be the shortest delay between pings.
  Serial.print("Ping: ");
  Serial.print(sonar.ping_cm()); // Send ping, get distance in cm and print result (0 = outside set distance range)
  Serial.println("cm");
  distance = sonar.ping_cm();*/

  if(serial.available())
  {
    value= serial.read();
    
    switch(value)
    {
     if(distance>15)
  {
  case 'F':
    digitalWrite(5,HIGH);
    digitalWrite(6,LOW);
    digitalWrite(10,LOW);
    digitalWrite(11,HIGH);  
    break;

  case 'B':
    digitalWrite(5,LOW);
    digitalWrite(6,HIGH);
    digitalWrite(10,HIGH);
    digitalWrite(11,LOW);  
    break;
       
   case 'R':
    digitalWrite(5,HIGH);
    digitalWrite(6,LOW);
    digitalWrite(10,LOW);
    digitalWrite(11,LOW);  
    break;
    
     case 'L':
    digitalWrite(5,LOW);
    digitalWrite(6,LOW);
    digitalWrite(10,LOW);
    digitalWrite(11,HIGH);  
    break;
    }

  else 
  {
     case 'S':
    digitalWrite(5,LOW);
    digitalWrite(6,LOW);
    digitalWrite(10,LOW);
    digitalWrite(11,LOW);  
    break;
      }
    }
}
}
