package com.service.impl;


import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.ResourceBundle;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;

import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.X509Certificate;

import org.apache.commons.codec.binary.Base64;
import org.apache.sling.commons.json.JSONArray;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;


public class ESignServics {
//	static ResourceBundle bundlestatic = ResourceBundle.getBundle("config_SKU1");

	Base64 base64 = new Base64();

	private static final String CREATE_TOKEN_GENERATION_API = "https://stin.gmo-agree.com/agree-api/v0/api/accesstoken/create";
	private static final String ACCESS_TOKEN_GENERATION_API = "https://stin.gmo-agree.com/agree-api/v0/api/accesstoken/generate";
	private static final String TRANSECTION_ID_ACQUISITION_API = "https://stin.gmo-agree.com/agree-api/v0/api/transaction/get";
	private static final String DOCUMENT_UPLOAD_API = "https://stin.gmo-agree.com/agree-api/v0/api/document/register";
	private static final String DOCUMENT_INFORMATION_REISTRATION_API = "https://stin.gmo-agree.com/agree-api/v0/api/document/registerInfo";
	private static final String SIGNATURE_POSITION_SETTING_API = "https://stin.gmo-agree.com/agree-api/v0/api/document/registerPosition";
	private static final String SIGNATURE_REREQUEST_API= "https://stin.gmo-agree.com/agree-api/v0/api/document/resend";
	private static final String DOCUMENT_STATE_ACQUISITION_API = "https://stin.gmo-agree.com/agree-api/v0/api/document/status";
	private static final String SIGNED_DOCUMENT_ACQUISITION_API= "https://api.gmo-agree.com/agree-api/v0/api/document/get";

	
	

	private static final String  cus_id = "IN019332208";
	private static final String secret_key = "AGR0TLuPfZCp3Scr0stRonSxOw4F8JaCTGa21vuatt";
//	private static final String cus_id = bundlestatic.getString("Globalsign_cus_id");
//	private static final String secret_key = bundlestatic.getString("Globalsign_secret_key");

	public static void main(String[] args) throws JSONException {
		String access_token=null;
		String Xid=null;
		JSONObject documentuploadresp=null;
		JSONObject documentinforesp=null;

		
		ESignServics esignServics = new ESignServics();
//		
//		String creatstatus  =esignServics.Create_token_generation();
//		System.out.println("creatstatus  "+creatstatus);
//if(creatstatus.equalsIgnoreCase("true")) {
//		 access_token =esignServics.Access_token_generation();
//		if(access_token!=null) {
//		Xid=esignServics.Transaction_ID_acquisition(access_token);
//		System.out.println("Xid "+Xid);
//		   if( Xid!=null ) {
//			 documentuploadresp =esignServics.Document_upload(access_token, Xid, "http://uk.bluealgo.com:8085/Attachment/508e3f60-b2d9-4249-881b-4e415f0a54a7.pdf");
//			System.out.println("documentuploadresp  "+documentuploadresp);
//			 if (documentuploadresp!=null && documentuploadresp.has("status") && documentuploadresp.getString("status").equalsIgnoreCase("0")) {
//					esignServics.Document_information_registration(access_token, Xid, "abc", "", "Doctier", new JSONArray(), "3", "2");
//				}
//		}
//		}
//	}
		
//		
//		String creatstatus  =esignServics.Create_token_generation();
//		System.out.println("creatstatus  "+creatstatus);
//if(creatstatus.equalsIgnoreCase("true")) {
		 access_token =esignServics.Access_token_generation();
		 
		// System.out.println("access_token "+access_token);
		if(access_token!=null) {
			//esignServics.Signature_rerequest_API(access_token, "IW2xfu1oYI3kLmr98", "xKAfPalHHgorWNW9Ekd9Y6nJKvIv7r71", "");
			esignServics.Document_status_acquisition_API(access_token, "IW2xfu1oYI3kLmr98");
			//esignServics.Signed_document_acquisition_API(access_token, "IW2xfu1oYI3kLmr98");

		}
	//}	
		
		
	}
	public String Create_token_generation() {
		JSONObject respobj =null;
		String access_token=null;
		
		
		try {
			
			JSONObject obj = new JSONObject();
			obj.put("secret_key", secret_key);
			obj.put("cus_id", cus_id);

			String resp=callPostJSon(CREATE_TOKEN_GENERATION_API, obj);
			//System.out.println("resp "+resp);
			if(isJSONValid(resp)) {
				respobj = new JSONObject(resp);
				if(respobj.has("status") && respobj.getString("status").equals("0") && respobj.has("result")) {
					//access_token= obj.getJSONObject("result").getString("access_token");
				}
				
			}
		} catch (Exception e) {
			e.printStackTrace();
			return "false";
		}
		return "true";
	}
	
	public String Access_token_generation() {
		JSONObject respobj =null;
		String access_token=null;
		
		
		try {
			
			JSONObject obj = new JSONObject();
			obj.put("secret_key", secret_key);
			obj.put("cus_id", cus_id);

			String resp=callPostJSon(ACCESS_TOKEN_GENERATION_API, obj);
			System.out.println("resp "+resp);
			if(isJSONValid(resp)) {
				respobj = new JSONObject(resp);
				if(respobj.has("status") && respobj.getString("status").equals("0") && respobj.has("result")) {
					access_token= respobj.getJSONObject("result").getString("access_token");
				}
				
			}
		} catch (Exception e) {
			e.printStackTrace();
			return e.getMessage();
		}
		return access_token;
	}



	public String Transaction_ID_acquisition(String access_token) {
		JSONObject respobj =null;
		String Xid=null;
		
		try {
			if(access_token!=null) {
			JSONObject obj = new JSONObject();
			obj.put("secret_key", secret_key);
			obj.put("cus_id", cus_id);
			obj.put("access_token", access_token);


			String resp=callPostJSon(TRANSECTION_ID_ACQUISITION_API, obj);
			if(isJSONValid(resp)) {
				respobj = new JSONObject(resp);
				if(respobj.has("status") && respobj.getString("status").equals("0") && respobj.has("result")) {
					Xid= respobj.getJSONObject("result").getString("xid");
				}
			}
			}
		} catch (Exception e) {

			return null;
		}
		return Xid;
	}

	
	public JSONObject Document_upload(String access_token, String xid, String documentlink) {
		
		JSONObject respobj =null;
		String documents_count=null;
		String is_over=null;
		String documentbas64=null; 
		JSONObject returnobj = new JSONObject();
		
		try {
			JSONObject obj = new JSONObject();
			obj.put("secret_key", secret_key);
			obj.put("cus_id", cus_id);
			obj.put("access_token", access_token);
			obj.put("xid", xid);

			try {
			    URL imageUrl = new URL(documentlink);
		        URLConnection ucon = imageUrl.openConnection();
		        InputStream is = ucon.getInputStream();
		        ByteArrayOutputStream baos = new ByteArrayOutputStream();
		        byte[] buffer = new byte[1024];
		        int read = 0;
		        while ((read = is.read(buffer, 0, buffer.length)) != -1) {
		            baos.write(buffer, 0, read);
		        }
		        baos.flush();
		        documentbas64= Base64.encodeBase64String(baos.toByteArray());
		    } catch (Exception e) {
		        System.out.println("Error" +e.getMessage());
		       // e.printStackTrace();
		    }
			
			obj.put("document", documentbas64);

			if(access_token!=null && xid!=null && documentbas64!=null) {
			String resp=callPostJSon(DOCUMENT_UPLOAD_API, obj);
			if(isJSONValid(resp)) {
				respobj = new JSONObject(resp);
				if(respobj.has("status") && respobj.getString("status").equals("0") && respobj.has("result")) {
					documents_count= respobj.getJSONObject("result").getString("documents_count");
					is_over= respobj.getJSONObject("result").getString("is_documents_over");
				}
			}
			}
			returnobj.put("documents_count", documents_count );
			returnobj.put("is_over", is_over);
			returnobj.put("status", respobj.getString("status"));


		} catch (Exception e) {
			//e.printStackTrace();
			
			try {
				returnobj.put("status", "error");
			} catch (JSONException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}

			return returnobj;
		}
		return returnobj;
	}
	
	public String Document_information_registration(String access_token, String Xid, String document_nam, String post_nm, 
			String name_nm, JSONArray folders,String document_type, String is_workflow_show) {
	
		JSONObject respobj=null;
		String status=null;
		try {
			JSONObject obj = new JSONObject();
			obj.put("secret_key", secret_key);
			obj.put("cus_id", cus_id);
			obj.put("access_token", access_token);
			obj.put("xid", Xid);
			obj.put("document_name" ,document_nam);
			obj.put("post_nm" ,post_nm);
			obj.put("name_nm" ,name_nm);
			obj.put("folders", folders);
			obj.put("document_type" ,document_type);
			obj.put("is_workflow_show", is_workflow_show);

			String resp=callPostJSon(DOCUMENT_INFORMATION_REISTRATION_API, obj);
			if(isJSONValid(resp)) {
				respobj = new JSONObject(resp);
				if(respobj.has("status") && respobj.getString("status").equals("0")) {
					status="0";
				}
			}
		}catch(Exception e) {
			status="1";
		}
	return status;
	}
	
	public String Signature_position_setting(JSONObject obj ) {
		JSONObject respobj=null;
		String status=null;
		String resp=null;
		try {
			obj.put("secret_key", secret_key);
            obj.put("cus_id", cus_id);
			 resp=callPostJSon(SIGNATURE_POSITION_SETTING_API, obj);
		
			
		}catch(Exception e) {resp=null;}
		return resp;
	}
	

	
	public String Signature_rerequest_API(String access_token, String Xid, String document_token, String email ) {
		JSONObject respobj=null;
		String status=null;
		String resp=null;
		try {
			JSONObject obj = new JSONObject();
			obj.put("secret_key", secret_key);
            obj.put("cus_id", cus_id);
            obj.put("access_token", access_token);
            obj.put("xid", Xid);
            obj.put("document_token", document_token);
            obj.put("OWN_ORGANIZE_NM", "");
            obj.put("OWN_NAME_NM", "");
            obj.put("is_redirection", "");
            obj.put("ORGANIZE_NM", "");
            obj.put("NAME_NM", email);
            obj.put("email", email);

          //  System.out.println("obj  "+obj );
			 resp=callPostJSon(SIGNATURE_REREQUEST_API, obj);
	          //  System.out.println("resp  "+resp );
		}catch(Exception e) {resp=null;}
		return resp;
	}
	
	
	public String Document_status_acquisition_API(String access_token, String Xid ) {
		JSONObject respobj=null;
		String status=null;
		String resp=null;
		try {
			JSONObject obj = new JSONObject();
			obj.put("secret_key", secret_key);
            obj.put("cus_id", cus_id);
            obj.put("access_token", access_token);
            obj.put("xid", Xid);

           // System.out.println("obj  "+obj );
			 resp=callPostJSon(DOCUMENT_STATE_ACQUISITION_API, obj);
	          //  System.out.println("resp  "+resp );
		}catch(Exception e) {resp=null;}
		return resp;
	}


	
	public String Signed_document_acquisition_API(String access_token, String Xid ) {
		JSONObject respobj=null;
		String status=null;
		String resp=null;
		try {
			JSONObject obj = new JSONObject();
			obj.put("secret_key", secret_key);
            obj.put("cus_id", cus_id);
            obj.put("access_token", access_token);
            obj.put("xid", Xid);
            obj.put("download_type", "2");

           // System.out.println("obj  "+obj );
			 resp=callPostJSon(SIGNED_DOCUMENT_ACQUISITION_API, obj);
	          //  System.out.println("resp  "+resp );
		}catch(Exception e) {resp=null;}
		return resp;
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
	
	
	
	public String callPostJSon(String urlstr, JSONObject Obj) {
		System.out.println("Obj "+Obj);
		StringBuffer response =null;
			  int responseCode = 0;
			  String urlParameters = "";
			  
			  
			    TrustManager[] trustAllCerts = new TrustManager[] {
			    	       new X509TrustManager() {
			    	          public java.security.cert.X509Certificate[] getAcceptedIssuers() {
			    	            return null;
			    	          }
			    	          public void checkClientTrusted(X509Certificate[] certs, String authType) {  }
			    	          public void checkServerTrusted(X509Certificate[] certs, String authType) {  }
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
			  
			  try {

			   URL url = new URL(urlstr);
			   HttpsURLConnection con = (HttpsURLConnection) url.openConnection();
			   con.setRequestMethod("POST");

			   con.setRequestProperty("Content-Type", "application/json");
			   con.setRequestProperty("Accept-Charset", "UTF-8");
			  
			   con.setDoOutput(true);
			   DataOutputStream wr = new DataOutputStream(con.getOutputStream());
			   wr.writeBytes(Obj.toString());
			   wr.flush();
			   wr.close();

			   responseCode = con.getResponseCode();

			   BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
			   String inputLine;
			    response = new StringBuffer();

			   while ((inputLine = in.readLine()) != null) {
			    response.append(inputLine);
			   }
			   in.close();

			   System.out.println("api resp "+response.toString());
			  }
			  catch (Exception e) {
				  e.printStackTrace();
			return   e.getMessage();
			  }
			  return response.toString();

			 }
	
	
	
//	public static void main(String[] args)  {
//	    String Url = "http://uk.bluealgo.com:8085/Attachment/h_26-Sep-2019_12-26-04-624.pdf";
//	   // String destinationFile = "image.jpg";
//try {
//	    URL imageUrl = new URL(Url);
//        URLConnection ucon = imageUrl.openConnection();
//        InputStream is = ucon.getInputStream();
//        ByteArrayOutputStream baos = new ByteArrayOutputStream();
//        byte[] buffer = new byte[1024];
//        int read = 0;
//        while ((read = is.read(buffer, 0, buffer.length)) != -1) {
//            baos.write(buffer, 0, read);
//        }
//        baos.flush();
//        System.out.println( Base64.encodeBase64String(baos.toByteArray()));
//    } catch (Exception e) {
//        System.out.println("Error");
//        e.printStackTrace();
//    }
//	}


	

	/**
	 * Encodes the byte array into base64 string
	 *
	 * @param imageByteArray - byte array
	 * @return String a {@link java.lang.String}
	 */
	public static String encodeImage(byte[] imageByteArray) {
	    return Base64.encodeBase64String(imageByteArray);
	}
}


