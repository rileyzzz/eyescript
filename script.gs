include "multiplayergame.gs"
include "locomotive.gs"
include "world.gs"
include "train.gs"
include	"meshobject.gs"
include "vehicle.gs"
include "gs.gs"
include "superstub.gs"
include "asset.gs"
include "tttelocomotive.gs"
include "gameobjectid.gs"
class script isclass SSLoco
{


	bool m_bIsForwardPressed, m_bIsBackwardPressed, m_bIsLeftPressed, m_bIsRightPressed;
	bool Whistling = false;
	bool Wheeshing = false;
	bool DeRailed = false;
	bool BrowserClosed;
	bool HasFocus = false;
	bool Dial = false;
	bool Dial2 = false;
	bool recording = false;
	bool playing = false;
	float version;

	float pithing = 3.1415/180;
	Library Codelib;

	
	thread void VehicleMonitor(void);
	thread void ScanBrowser(void);
	thread void EyeCheck(void);
	thread void MultiplayerBroadcast(void);	
	thread void record(void);
	thread void playanim(void);
	thread void SliderCheck(void);
	thread void DialCheck(void);
	void ConstructBrowser();
	void SliderApply(void);
	void sniffMyTrain(void);
	Browser browser;
	Train myTrain;

	float eyelr = 0.0;
	float eyeud = 0.0;
	float eyer = 0.0;
	
	int submesh = 1;
	Soup submeshes;
	
	int lerpcount = 1;
	float eyelrprev = 0.0;
	float eyeudprev = 0.0;
	int lerpres = 4;
	
	
	
	float[] lrframes;
	float[] udframes;
	float[] rframes;	
	
	
   public void Init(void) {
      inherited();
		
		
		
		
		AddHandler(me, "Eyescript", "Up", "HandleKeyForward");
		AddHandler(me, "Eyescript", "UpR", "HandleKeyForwardUp");
		AddHandler(me, "Eyescript", "Down", "HandleKeyBackward");
		AddHandler(me, "Eyescript", "DownR", "HandleKeyBackwardUp");
		AddHandler(me, "Eyescript", "Left", "HandleKeyLeft");
		AddHandler(me, "Eyescript", "LeftR", "HandleKeyLeftUp");
		AddHandler(me, "Eyescript", "Right", "HandleKeyRight");
		AddHandler(me, "Eyescript", "RightR", "HandleKeyRightUp");
		
		
		AddHandler(me, "Eyescript", "FLeft", "HandleKeyFLeft");
		AddHandler(me, "Eyescript", "FRight", "HandleKeyFRight");
		AddHandler(me, "Eyescript", "Whs", "HandleWheesh");
		AddHandler(me, "Eyescript", "WhsUp", "HandleWheeshUp");
		
		
		
		//MULTIPLAYER HANDLER
		AddHandler(me, "EyescriptMP", "update", "MPUpdate");
		
		
		Codelib = World.GetLibrary(GetAsset().LookupKUIDTable("codelib"));
		
		myTrain = me.GetMyTrain();
		

		
		submeshes = me.GetAsset().GetConfigSoup().GetNamedSoup("extensions").GetNamedSoup("submeshes-122285");
		
		
        version = World.GetTrainzVersion();
		sniffMyTrain();
		EyeCheck();
		MultiplayerBroadcast();
        VehicleMonitor();
        ScanBrowser();
   }


	 

	 
	 
	 
	float Lerp(float from, float to, float t)
	{
		return (from + (to - from)*t);
	}
	
	 
	 
	 	
	void SliderApply() {
	
		SetMeshOrientation("eye_l", eyeud, eyer, eyelr);
		SetMeshOrientation("eye_r", eyeud, eyer, eyelr);

	}
	 
	 

thread void record()
{
	lrframes = new float[0];
	udframes = new float[0];
	rframes = new float[0];	
	while(recording == true)
	{
		udframes[udframes.size()] = eyeud;
		rframes[rframes.size()] = eyer;
		lrframes[lrframes.size()] = eyelr;
		Sleep(0.04);
	}
}


thread void playanim()
{
playing = true;
  int n;
  for (n = 0; n < udframes.size(); n++) {
	SetMeshOrientation("eye_l", udframes[n], rframes[n], lrframes[n]);
	SetMeshOrientation("eye_r", udframes[n], rframes[n], lrframes[n]);
	Sleep(0.04);
  }
  playing=false;
}













void ConstructBrowser()
{
        browser = null;
        if ( !browser )	browser = Constructors.NewBrowser();

        browser.SetCloseEnabled(true);
	browser.SetWindowPosition(Interface.GetDisplayWidth()-320, Interface.GetDisplayHeight() - 525);
	browser.SetWindowSize(300, 350);
	browser.SetWindowVisible(true);
	browser.LoadHTMLFile(GetAsset(), "ui.html");
	BrowserClosed = false;
}



thread void VehicleMonitor()
{                                // runs continuously
   bool donkey = false;
   bool AI_on = false;

   sniffMyTrain();               // resets myTrain..


   while (! DeRailed)
     {
        sniffMyTrain();

        if (AI_on and (myTrain.GetAutopilotMode() == Train.CONTROL_MANUAL) and (version < 3.5))
        {
          AI_on = false;
        }
        if ((version > 3.4) and !HasFocus)
        {
            browser = null;  // close browser if train is moving
            BrowserClosed = true;
        }

        if ((myTrain.GetAutopilotMode() == Train.CONTROL_MANUAL) and ((version<= 3.4) or ((version > 3.4) and HasFocus)))
        {

          if (BrowserClosed) { ConstructBrowser(); BrowserClosed = false; }
          Sleep(0.5);
        }
        if (myTrain.GetAutopilotMode() != Train.CONTROL_MANUAL) AI_on = true;

        Sleep(0.5);
    }
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






thread void SliderCheck() {
	while(Dial == true){
		
			//browser.SetTrainzText("lrtext","init");
			
			string lr = browser.GetElementProperty("lrslider", "value");

			string ud = browser.GetElementProperty("udslider", "value");
			
			

			
			
			
			eyelr = pithing*Str.UnpackFloat(lr);
			eyeud = pithing*Str.UnpackFloat(ud);

			//eyeud = eyeud + 0.01;
			//eyelr = eyelr + 0.01;
					
					
					

					
					
					
					
					
					
					
					
					
					
		if(playing == false){
		SetMeshOrientation("eye_l", eyeud, eyer, eyelr);
		SetMeshOrientation("eye_r", eyeud, eyer, eyelr);
		}
	
	
			Sleep(0.04);
		}
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


	//MULTIPLAYER HANDLING

	thread void MultiplayerBroadcast() {
		while(true)
		{
			DriverCharacter driver = me.GetMyTrain().GetActiveDriver();
			if (MultiplayerGame.IsActive() and driver and driver.IsLocalPlayerOwner()) { 
				//CHECK FOR CLIENT OWNERSHIP, OTHERWISE IT WILL GET MESSY

				//me should be train, inherits right?


				//this thread will package up data and send it across the server to be listened for, figure out how to parse individually TBA
				//individual engine ID?
			
				Soup senddata = Constructors.NewSoup();       // this soup will be empty
				senddata.SetNamedTag("eyeud",eyeud);
				senddata.SetNamedTag("eyelr",eyelr);
				senddata.SetNamedTag("eyer",eyer);
				senddata.SetNamedTag("submesh",submesh);
				senddata.SetNamedTag("wheesh",Wheeshing);
				senddata.SetNamedTag("id",me.GetGameObjectID());
				MultiplayerGame.BroadcastGameplayMessage("EyescriptMP", "update", senddata);
				//MultiplayerGame.SendGameplayMessageToServer("EyescriptMP", "update", senddata); //Send to the host too!!!!
				//Interface.Print("Multiplayer Data Sent!");
				
			}
			Sleep(0.12); // don't go too crazy with data
		}
	}

	 
	 
	 
	public void MPUpdate(Message msg)
	{
		Soup ReceivedData = msg.paramSoup;
		
		DriverCharacter driver = me.GetMyTrain().GetActiveDriver();
		if(driver.IsLocalPlayerOwner() == false and me.GetGameObjectID().DoesMatch(ReceivedData.GetNamedTagAsGameObjectID("id"))) //this might not work idk
		{
			//Interface.Print("Data Confirmed!");
			float Reyeud = ReceivedData.GetNamedTagAsFloat("eyeud");
			float Reyelr = ReceivedData.GetNamedTagAsFloat("eyelr");
		
			int Rsubmesh = ReceivedData.GetNamedTagAsInt("submesh");

			eyeud = Reyeud;
			eyelr = Reyelr;
			if(submesh != Rsubmesh)
			{
				submesh = Rsubmesh;
				string tagname = submeshes.GetIndexedTagName(submesh);
				PostMessage(me, "SS-122285", "Submesh" + "," + tagname,0.0);
			}
			
			bool Rwheesh = ReceivedData.GetNamedTagAsBool("wheesh");
			
			if(Rwheesh and !Wheeshing)
			{
				PostMessage(me, "pfx", "+4",0.0);
			} else if(!Rwheesh and Wheeshing) {
				PostMessage(me, "pfx", "-4",0.0);
			}
		}
	}
	 
	 
	 
	 
	 
	 
	 
	 
	thread void EyeCheck() {
	 
		while(true)
		{

			if(lerpcount < lerpres){
				lerpcount = lerpcount + 1;
			} else {
				lerpcount = 1;
				eyeudprev = eyeud;
				eyelrprev = eyelr;
			}
	 
	 
			SetMeshOrientation("eye_l", Lerp(eyeudprev, eyeud, lerpcount/lerpres), eyer, Lerp(eyelrprev, eyelr, lerpcount/lerpres));
			SetMeshOrientation("eye_r", Lerp(eyeudprev, eyeud, lerpcount/lerpres), eyer, Lerp(eyelrprev, eyelr, lerpcount/lerpres));


		
			Sleep(0.01); //.2 rate
		}
	 }






















	

	
	
	
	
	
	

	

	
	public void HandleKeyForward(Message msg)
	{
		//implement all 4 later for keyboard support
	}
  
	public void HandleKeyForwardUp(Message msg)
	{
    //m_bIsForwardPressed = false;
	
	}
	public void HandleKeyBackward(Message msg)
	{
	eyeudprev = eyeud;
	Soup parameters = msg.paramSoup;
	parameters.GetNamedTagAsFloat("control-value");
    eyeud = -(parameters.GetNamedTagAsFloat("control-value") - 0.5)/1;
	//eyeud = 0.5;
	//SetMeshOrientation("eye_l", eyeud, eyer, eyelr);
	//SetMeshOrientation("eye_r", eyeud, eyer, eyelr);
	
	}
  
	public void HandleKeyBackwardUp(Message msg)
	{
    //m_bIsBackwardPressed = false;
	
	}
  
	public void HandleKeyLeft(Message msg)
	{
	eyelrprev = eyelr;
	Soup parameters = msg.paramSoup;
	parameters.GetNamedTagAsFloat("control-value");
    eyelr = (parameters.GetNamedTagAsFloat("control-value") - 0.5)/1;
	//eyeud = 0.5;
	//SetMeshOrientation("eye_l", eyeud, eyer, eyelr);
	//SetMeshOrientation("eye_r", eyeud, eyer, eyelr);
	
	}
  
	public void HandleKeyLeftUp(Message msg)
	{
    //m_bIsLeftPressed = false;
	
	}
  
	public void HandleKeyRight(Message msg)
	{

	
	}
  
	public void HandleKeyRightUp(Message msg)
	{
    //m_bIsRightPressed = false;
	
	}
	
	
	
	//from meshobject
	// <bi MeshObject Messages><br>
//
// {[ Major               | Minor               | Source       | Destination                 ]
//  [ "Animation-Event"   | event name          | mesh object  | mesh object                 ]
//  [ "fx-mesh-attached"  | effect name         | mesh object  | mesh object                 ]
//  [ "pfx"               | +/-particle number  | anywhere     | object to set particles of  ]}
//
	
	public void HandleKeyFLeft(Message msg)
	{
		if (submesh > 1){
		submesh = submesh - 1;
		}

		string tagname = submeshes.GetIndexedTagName(submesh);
		PostMessage(me, "SS-122285", "Submesh" + "," + tagname,0.0);
		//Interface.Print("Submesh" + "," + tagname);
	}
	
	public void HandleKeyFRight(Message msg)
	{
		if (submesh < submeshes.CountTags() - 1){
		submesh = submesh + 1;
		}
		string tagname = submeshes.GetIndexedTagName(submesh);
		PostMessage(me, "SS-122285", "Submesh" + "," + tagname,0.0);
		//Interface.Print("Submesh" + "," + tagname);
	}	
	
	
	
	

	
	
	
	public void HandleWheesh(Message msg)
	{
		//Interface.Print("Starting Wheesh");
		PostMessage(me, "pfx", "+4",0.0);  
		
		Wheeshing = true;
		
		//DEBUG MP EMULATION, CHECK BYPASS


			

		
		
		
		
		
		
		
		
		
	}	
	
	public void HandleWheeshUp(Message msg)
	{
		//Interface.Print("Stopping Wheesh");
		PostMessage(me, "pfx", "-4",0.0);  
		Wheeshing = false;
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
			//playing = false;
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

				//RECORDING FEATURE
		on "Browser-URL", "live://record", msg:	 // if browser link Slew Left is clicked
          if ( browser and msg.src == browser )
          {
			recording = true;
			record();
          }
             msg.src = null; 					 // clear message source to avoid confusion
             continue;
		on "Browser-URL", "live://record-stop", msg:	 // if browser link Slew Left is clicked
          if ( browser and msg.src == browser )
          {
			recording = false;
			
          }
             msg.src = null; 					 // clear message source to avoid confusion
             continue;          

		on "Browser-URL", "live://play", msg:	 // if browser link Slew Left is clicked
          if ( browser and msg.src == browser )
          {
			
			playanim();
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