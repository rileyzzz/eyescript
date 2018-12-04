
include "locomotive.gs"
include "world.gs"
include "train.gs"
include	"my_script.gs"
include	"meshobject.gs"
include "vehicle.gs"
include "gs.gs"
include "Browser.gs"
include "superstub.gs"
include "asset.gs"
include "MultiplayerGame.gs"
include "soup.gs"

class script isclass my_script
{


	
	bool DeRailed = false;
	bool BrowserClosed;
	bool HasFocus = false;
	bool Dial = false;
	bool Dial2 = false;
	float eyeframe;
    float eyerotation;
	float version;
	float pithing = 3.1415/180;
	
	
	thread void VehicleMonitor(void);
	thread void ScanBrowser(void);
	thread void SliderCheck(void);
	thread void DialCheck(void);
	
	void ConstructBrowser();
	void sniffMyTrain(void);
	void SliderApply(void);
	
	Browser browser;
	Train myTrain;

	float eyelr = 0.0;
	float eyeud = 0.0;
	float eyer = 0.0;
	
	
	
	

   public void Init(void) {
      inherited();
        AddHandler(me, "Vehicle", "Coupled", "VehicleCoupleHandler");
		//AddHandler(me, "Vehicle", "Decoupled", "VehicleDecoupleHandler");
		AddHandler(me,"OnlineAccess","update","MultiUpdate");
		
		
		
		
		
		
		if(me.GetMyTrain())
        {
		  //SetMeshAnimationFrame("eyes",30,1.0);

          sniffMyTrain();                     // resets myTrain
	  myTrain.SetPantographState(0);      // start with panto down.  Any value for pantograph
                                              // greater than 0 will cause the crane control browser
                                              // to be opened.

          version = World.GetTrainzVersion();
//          HasFocus = true;
		  
          VehicleMonitor();
          ScanBrowser();
		  //SliderCheck();
        }
   }




	void VehicleCoupleHandler(Message msg) {
	SetMeshAnimationFrame("default",0.0);      // move the animation to frame 5 instantaneously
	SetMeshAnimationState("default", true);
	}
    void sniffMyTrain() {
        Train oldTrain = myTrain;
        myTrain = me.GetMyTrain();

        if (oldTrain) {
           if (oldTrain != myTrain) {
               Sniff(oldTrain, "Train", "", false);
               Sniff(myTrain, "Train", "", true);
           }
        } else {
           Sniff(myTrain, "Train", "", true);
        }
    }
	void ConstructBrowser()
   {
        browser = null;
        if ( !browser )	browser = Constructors. NewBrowser();

        browser.SetCloseEnabled(true);
	browser.SetWindowPosition(Interface.GetDisplayWidth()-240, Interface.GetDisplayHeight() - 315);
	browser.SetWindowSize(400, 240);
//	browser.SetWindowTitle("Crane");
//	browser.SetWindowStyle(Browser.STYLE_NO_FRAME);
	browser.SetWindowVisible(true);
	browser.LoadHTMLFile(GetAsset(), "ui.html");
	BrowserClosed = false;
   }


     public string GetDescriptionHTML(void)
     {
	string html = inherited();
	html = html + "<table><tr><td><img src='PEV.tga' width=350 height=50>";
	html = html + "</td></tr><tr><td>"
	+ "<font color=#FFFFFF size=1>"
	+ "<b>OPERATION</b><br></font>"
	+ "<font color=#FFFFFF size=1>"
	+ "The crane controls are enabled automatically in TS12 and "
        + "by pressing the Pantographs button in TS2009 and TS2010 "
	+ "when the Crane Loco is selected when stationary. "
	+ "The slewing, jib raise-lower and hook raise-lower are "
	+ "controlled by clicking on the appropriate the arrow buttons."
        + "To stop movement press button again.<br>"
	+ "Moving the loco on the track closes the "
	+ "crane controls display in TS12."
	+ "<br><br>"
	+ "<font color=#FFFFFF size=1>"
	+ "<b>CONFIGURATION</b><br></font>"
	+ "<font color=#FFFFFF size=1>"
	+ "None required.";
	html = html + "</font></td></tr></table></body></html>";
	return html;
     }
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	void MultiUpdate(Message msg){
	
	
	
	
	
	
	
	Soup usoup = msg.paramSoup;
	
	
	//aw nice man you got my soup
		SetMeshOrientation("eye_l", usoup.GetNamedTagAsFloat("eyeud"), usoup.GetNamedTagAsFloat("eyer"), usoup.GetNamedTagAsFloat("eyelr"));
		SetMeshOrientation("eye_r", usoup.GetNamedTagAsFloat("eyeud"), usoup.GetNamedTagAsFloat("eyer"), usoup.GetNamedTagAsFloat("eyelr"));
	}
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 

	
	
	thread void SliderCheck() {
	while(Dial == true){
		
			//browser.SetTrainzText("lrtext","init");
			
			
			
			
			
			
			
			string lr = browser.GetElementProperty("lrslider", "value");

			string ud = browser.GetElementProperty("udslider", "value");
			
			

			
			//we gonna make sure its okay to send so we dont spam n stuff
			//if (eyelr != pithing*Str.UnpackFloat(lr) or eyeud != pithing*Str.UnpackFloat(ud)){
			eyelr = pithing*Str.UnpackFloat(lr);
			eyeud = pithing*Str.UnpackFloat(ud);
			
			
			
			
			//eyeud = eyeud + 0.01;
			//eyelr = eyelr + 0.01;
					
					
					

					
					
					
					
					
					
					
			//make some soup
			Soup soup = Constructors.NewSoup();       // this soup will be empty
			
			soup.SetNamedTag("eyeud",eyeud);
			soup.SetNamedTag("eyelr",eyelr);
			soup.SetNamedTag("eyer",eyer);
			
			
			//eat that soup
			if (MultiplayerGame.IsActive()) {
			MultiplayerGame.BroadcastGameplayMessage("OnlineAccess", "update", soup);
			}
			SetMeshOrientation("eye_l", eyeud, eyer, eyelr);
			SetMeshOrientation("eye_r", eyeud, eyer, eyelr);

	
			//}
			Sleep(0.04);
		}
	}
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 	
	void SliderApply() {

		
		
		SetMeshOrientation("eye_l", eyeud, eyer, eyelr);
		SetMeshOrientation("eye_r", eyeud, eyer, eyelr);
		

	}
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
thread void DialCheck()
{
	while(Dial2 == true)
	{
		int testf;
		
		
					eyer = pithing*Str.UnpackFloat(browser.GetElementProperty("dcc", "value"));

		
		
		
		
		

	
	
	
		Sleep(0.04);
	}




}



thread void VehicleMonitor()
{                                // runs continuously
   bool donkey = false;
   bool AI_on = false;
   int panto;
   sniffMyTrain();               // resets myTrain..

   panto = myTrain.GetPantographState();
   if (panto>0) myTrain.SetPantographState(0);
//   float TE = GetMaximumTractiveEffort();

   while (! DeRailed)
     {
        sniffMyTrain();

        // pantographs are automatically raised whenever the train is set to run in AI.
        // We need to ignore this so check if AI is on. (or manual control is off)
        // The crane is a steam loco so pantograph should be down when in manual control.
        if (AI_on and (myTrain.GetAutopilotMode() == Train.CONTROL_MANUAL) and (version < 3.5))
        {
          AI_on = false;
          myTrain.SetPantographState(0);
        }
        if ((version > 3.4) and !HasFocus)
        {
            browser = null;  // close browser if train is moving
            BrowserClosed = true;
        }

        panto = myTrain.GetPantographState();
        if ((myTrain.GetAutopilotMode() == Train.CONTROL_MANUAL) and (((panto>0) and (version<= 3.4)) or ((version > 3.4) and HasFocus)))
        {
          if (version < 3.5) myTrain.SetPantographState(0);

          if (BrowserClosed) { ConstructBrowser(); BrowserClosed = false; }
          Sleep(0.5);
        }
        if (myTrain.GetAutopilotMode() != Train.CONTROL_MANUAL) AI_on = true;

		
		
		
		
		
		
		
		
		

        Sleep(0.5);
    }
 }
	
	
thread void ScanBrowser() {
   float frame;
   float ttime;
   Message msg;



	wait(){
		on "Vehicle", "Derailed", msg:
          {
          if(msg.src == me)
             {
               //Interface.Log("VehicleMonitor: I am derailed");
               DeRailed = true;
             }
          }
		     msg.src = null; 				         // clear message source to avoid confusion
             continue;
		  
		  
		   on "Camera","Target-Changed", msg:
           {
           //  Interface.ShowHelpPopup("Camera Scan, "+ msg.minor,GetAsset(),Interface.GetTimeStamp());

             if(msg.src == me) { HasFocus = true; }
             else { HasFocus = false; }
           }
           msg.src = null;
           continue;


          on "Browser-URL", "live://eye-resetr", msg:	 // if browser link Slew Left is clicked
          if ( browser and msg.src == browser )
          {



			
          }
		     msg.src = null; 				         // clear message source to avoid confusion
             continue;
		             on "Browser-URL", "live://eye-resetl", msg:	 // if browser link Slew Left is clicked
          if ( browser and msg.src == browser )
          {


			
          }
		     msg.src = null; 				         // clear message source to avoid confusion
             continue;

		             on "Browser-URL", "live://eye-resetu", msg:	 // if browser link Slew Left is clicked
          if ( browser and msg.src == browser )
          {


			
          }
		     msg.src = null; 				         // clear message source to avoid confusion
             continue;
			 
			 
			 
		             on "Browser-URL", "live://eye-resetd", msg:	 // if browser link Slew Left is clicked
          if ( browser and msg.src == browser )
          {



			
          }
		     msg.src = null; 				         // clear message source to avoid confusion
             continue;
			 

			 
			 
			 
			 		             on "Browser-URL", "live://eye-4", msg:	 // if browser link Slew Left is clicked
          if ( browser and msg.src == browser )
          {

			if (Dial == true)
			{
			Dial = false;
			
			}else {
			
			Dial = true;
			

			SliderCheck();
			}

			
          }
		     msg.src = null; 				         // clear message source to avoid confusion
             continue;
			 
			 
			 			 		             on "Browser-URL", "live://eye-5", msg:	 // if browser link Slew Left is clicked
          if ( browser and msg.src == browser )
          {

			if (Dial2 == true)
			{
			Dial2 = false;
			
			}else {
			
			Dial2 = true;
			
			DialCheck();
			}

			
          }
		     msg.src = null; 				         // clear message source to avoid confusion
             continue;
			 
			 
			 
          on "Browser-URL", "live://eye-6", msg:	 // if browser link Slew Left is clicked
          if ( browser and msg.src == browser )
          {


		  browser.SetElementProperty("dcc","value",(string)0.0);
		  browser.SetElementProperty("lrslider","value",(string)0.0);
		  browser.SetElementProperty("udslider","value",(string)0.0);
		  
		  
		  
		  
		  
		  
		  
		  
			
          }
             msg.src = null; 					 // clear message source to avoid confusion
             continue;



          




          on "Browser-Closed", "", msg:	                         // if browser is Closed
              {
                if ( browser and msg.src == browser ) browser = null;
                BrowserClosed = true;
              }

             msg.src = null;				         // clear message source to avoid confusion
             continue;
          Sleep(0.5);
     
		}
	}
	
};