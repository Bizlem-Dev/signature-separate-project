package com.service.impl;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.cert.X509Certificate;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Session;
import javax.jcr.Workspace;
import javax.jcr.query.Query;
import javax.jcr.query.QueryResult;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.commons.json.JSONArray;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;

public class GetAllMethodsHere {

	// instance variable
	
		String instanceEmail;
		Session sessionInstance; 
		SlingHttpServletResponse responseInstance;
		
		// create constructor 
		
		public GetAllMethodsHere(String email, Session session, SlingHttpServletResponse response){
			
			instanceEmail=email;
			sessionInstance=session;
			responseInstance=response;
		}
		
      public Node freeTrialCheck(){
			String FreetrialStatus=checkfreetrial(instanceEmail);
			
			Node userEmailNode=grtServiceidnode(FreetrialStatus, instanceEmail, sessionInstance, responseInstance);
			
		return userEmailNode;
	}
       
       JSONArray mainLogic(){
    	   JSONArray groupArray=new JSONArray();
    	   try{
    		   
    	   Node userEmailNode=freeTrialCheck();
    	   
    	   if( userEmailNode!=null ){
    		   
    		   if (userEmailNode.getPath().toString().contains("freetrial")) {
    			   JSONObject groupObbj=new JSONObject();
    			   groupObbj.put("groupname", "no group");
    			   groupArray.put(groupObbj);
    			   
    		   } // freetrial 
    		   else{
    			  // responseInstance.getWriter().println("shoppingcart: "+userEmailNode.getPath());
    			   
    			   if(userEmailNode.hasNodes()){
    				  NodeIterator itr= userEmailNode.getNodes();
    				  
    				  while(itr.hasNext()){
    					  
    					 String nodeName= itr.nextNode().getName().toString();
    					 
    					   JSONObject groupObbj=new JSONObject();
    	    			   groupObbj.put("groupname",nodeName);
    	    			   groupArray.put(groupObbj);
    					  
    				  } // while close
    				  
    			   } // node has check
    			   
    			   
    		   } // shopping else check
    		   
    	   } // userEmailNode blank check
    	   
    	   }catch(Exception e){
    		   PrintWriter out=null;
    		  try {
				 out= responseInstance.getWriter();
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
    		   
    		   e.printStackTrace(out);
    	   }
		return groupArray;
    	   
   	}
       
		public void printOutputArray(){
			
			try {
				responseInstance.getWriter().println(mainLogic());
				
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		
	
	public static void main(String[] args) {
	}
	
	public static boolean isNullString(String p_text) {
		if (p_text != null && p_text.trim().length() > 0 && !"null".equalsIgnoreCase(p_text.trim())) {
			return false;
		} else {
			return true;
		}
	}

	public static boolean isJSONValid(String test) {
		try {
			new JSONObject(test);
		} catch (JSONException ex) {
			
			try {
				new JSONArray(test);
			} catch (JSONException ex1) {
				return false;
			}
		}
		return true;
	}
	
	public String checkfreetrial(String userid) {
		int expireFlag = 0;
		if (userid.equalsIgnoreCase("viki@gmail.com") || userid.equalsIgnoreCase("nilesh@gmail.com")) {
			System.out.println("userid " + userid);
			expireFlag = 1;
		}
		String addr = "http://uk.bluealgo.com:8087/apirest/trialmgmt/trialuser/" + userid + "/DocTigerFreeTrial";
		
		try {
			ignoreHttps(addr);
			URL url = new URL(addr);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("GET");

			conn.connect();
			InputStream in = conn.getInputStream();
			BufferedReader reader = new BufferedReader(new InputStreamReader(in));
			String text = reader.readLine();
			System.out.println(text);
			JSONObject obj = new JSONObject(text);

			if (obj.has("freetrial") ) {
				/*int freetrialflag=0;
				int expireFlaginjson=0;
				freetrialflag = obj.getInt("freetrial");
				expireFlaginjson = obj.getInt("expireFlag");*/

				
			System.out.println(expireFlag);
		} else {
			expireFlag = 1;
		}

			conn.disconnect();
		} catch (Exception ex) {
			ex.printStackTrace();
			expireFlag = 1;

		}
		return expireFlag + "";

	}
	
	public Node grtServiceidnode(String freetrialstatus, String email, Session session1,
			SlingHttpServletResponse response) {

		PrintWriter out = null;

		Node contentNode = null;
		Node appserviceNode = null;
		Node appfreetrialNode = null;
		Node emailNode = null;
		String adminserviceid = "";
		
		try {
			out = response.getWriter();

			if (session1.getRootNode().hasNode("content")) {
				contentNode = session1.getRootNode().getNode("content");
			} else {
				contentNode = session1.getRootNode().addNode("content");
			}
			if (freetrialstatus.equalsIgnoreCase("0")) {

				if (contentNode.hasNode("services")) {
					appserviceNode = contentNode.getNode("services");

					if (appserviceNode.hasNode("freetrial")) {
						appfreetrialNode = appserviceNode.getNode("freetrial");

						if (appfreetrialNode.hasNode("users")
								&& appfreetrialNode.getNode("users").hasNode(email.replace("@", "_"))) {
							emailNode = appfreetrialNode.getNode("users").getNode(email.replace("@", "_"));
							appfreetrialNode = emailNode;

						} else {
							
						}
					} else {
					}
				} else {
				}

			} else {

				if (contentNode.hasNode("user") && contentNode.getNode("user").hasNode(email.replace("@", "_"))) {
					emailNode = contentNode.getNode("user").getNode(email.replace("@", "_"));
					if (emailNode.hasNode("services") && emailNode.getNode("services").hasNode("doctiger")
							&& emailNode.getNode("services").getNode("doctiger").hasNodes()) {
						NodeIterator itr = emailNode.getNode("services").getNode("doctiger").getNodes();
						while (itr.hasNext()) {
							adminserviceid = itr.nextNode().getName();
							if (!adminserviceid.equalsIgnoreCase("DocTigerFreeTrial")) {
								if ((adminserviceid != "") && (!adminserviceid.equals("DocTigerFreeTrial"))) {

									if (contentNode.hasNode("services")) {
										appserviceNode = contentNode.getNode("services");
									} else {
										appserviceNode = contentNode.addNode("services");
									}
									
									if (appserviceNode.hasNode(adminserviceid)) {
										appfreetrialNode = appserviceNode.getNode(adminserviceid);

									}

									break;
								}

							}
						}
					}
				}

			}

		} catch (Exception e) {
			out.println(e.getMessage());
			appfreetrialNode = null;
		}

		return appfreetrialNode;
	}
	
public  boolean checkFileNameFromSling(PrintWriter out, Node DocumentTracking, String nodeNameString, Session session){
		
		boolean checkFileName=false;
		
		try {
			
			if (!isNullString(nodeNameString)) {
				
				String path = DocumentTracking.getPath();
				path = (isNullString(path)) ? "" : path;
				Workspace workspace = session.getWorkspace();
				
				/*String slingqery = "select [filename] from [nt:base] where filename ='" + fileName
						+ "'  and ISDESCENDANTNODE('" + path + "')";*/
				
				String slingqery ="select [documentName] from [nt:base] where contains('documentName','%"+nodeNameString+"%') and ISDESCENDANTNODE('" + path + "')";

				Query query = workspace.getQueryManager().createQuery(slingqery, Query.JCR_SQL2);
				QueryResult queryResult = query.execute();
				NodeIterator iterator = queryResult.getNodes();
				
				Node obj = null;
				while (iterator.hasNext()) {
					obj = iterator.nextNode();
					checkFileName=true;
					
				} // while close

				
				
				
			} // null check filename
			
			
		} catch (Exception e) {
			e.printStackTrace(out);
			return checkFileName;
		}
		return checkFileName;
	}
		
//InputStream -> File
public String copyInputStreamToFile(InputStream inputStream, File file) {
	 String message=null;
	try {
		
		FileOutputStream outputStream = new FileOutputStream(file);
		int read;
        byte[] bytes = new byte[1024];

        while ((read = inputStream.read(bytes)) != -1) {
            outputStream.write(bytes, 0, read);
            message="success";
        }
        outputStream.close();
		
	} catch (Exception e) {
		return message;
	}
	return message;
}

public void ignoreHttps(String urlstring){
	   try{
	   if(urlstring.indexOf("https:") != -1){
	   TrustManager[] trustAllCerts = new TrustManager[] {
	   new X509TrustManager() {
	   public java.security.cert.X509Certificate[] getAcceptedIssuers() {
	   return null;
	   }

	   public void checkClientTrusted(X509Certificate[] certs, String authType) { }

	   public void checkServerTrusted(X509Certificate[] certs, String authType) { }

	   }
	   };


	   try {
	   SSLContext sc = SSLContext.getInstance("SSL");
	   sc.init(null, trustAllCerts, new java.security.SecureRandom());
	   HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());

	   } catch (Exception e1) {
	   // TODO Auto-generated catch block
	   e1.printStackTrace();
	   }

	   // Create all-trusting host name verifier
	   HostnameVerifier allHostsValid = new HostnameVerifier() {
	   public boolean verify(String hostname, SSLSession session) {
	   return true;
	   }
	   };
	   // Install the all-trusting host verifier
	   HttpsURLConnection.setDefaultHostnameVerifier(allHostsValid);
	   /*
	   * end of the fix
	   */
	   }
	   }catch(Exception e){
     e.printStackTrace();
	   }
	   }
	
}
