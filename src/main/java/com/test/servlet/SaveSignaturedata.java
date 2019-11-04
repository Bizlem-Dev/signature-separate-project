package com.test.servlet;


import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.cert.X509Certificate;
import java.util.Iterator;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Session;
import javax.jcr.SimpleCredentials;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.servlet.ServletException;

import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.commons.json.JSONArray;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.apache.sling.jcr.api.SlingRepository;

import com.service.impl.ESignServics;
import com.service.impl.FreeTrialandCart;
import com.sun.jersey.core.util.Base64;


@SlingServlet(paths = "/servlet/service/saveSignaturedata")

public class SaveSignaturedata extends SlingAllMethodsServlet {

	private static final long serialVersionUID = 1L;
	
	@Reference
	private SlingRepository repo;
	
	Session session = null;
	
	protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response)
			throws ServletException, IOException {
		
		PrintWriter out=response.getWriter();
		//String email=request.getRemoteUser();
		//out.println("email "+email);
		String url=null;
		String email=null;
		String group=null;
		String documentname=null;
		String filename=null;
		String filedata=null;
		JSONArray signerdata=null;
		JSONArray signpositionData=null;
		
		
		 Node serviceidNode=null;
		 Node groupnode=null;
		 Node EsignatureModule=null;
		Node  EsignatureModulecountNode=null;
		Node TemplateFile=null;
		Node signerdataNode=null;
		Node onesignerNode=null;
		
		
		JSONObject EsignatureMysqlJson= new JSONObject();
		JSONArray signeremailarraylist=new JSONArray();

		try{
			
			session = repo.login(new SimpleCredentials("admin", "admin".toCharArray()));
			
			BufferedInputStream bis = new BufferedInputStream(request.getInputStream());
			ByteArrayOutputStream buf = new ByteArrayOutputStream();
			int result = bis.read();

			while (result != -1) {
				buf.write((byte) result);
				result = bis.read();
			}
			String res = buf.toString("UTF-8");
			JSONObject resultjsonobject = new JSONObject(res);
			out.println("resultjsonobject "+resultjsonobject);
			if(resultjsonobject.has("email")) { email=resultjsonobject.getString("email");}
			if(resultjsonobject.has("group")) { group=resultjsonobject.getString("group");}
			if(resultjsonobject.has("DocumentName")) { documentname=resultjsonobject.getString("DocumentName");}
			if(resultjsonobject.has("filename")) { filename=resultjsonobject.getString("filename");}
			if(resultjsonobject.has("filedata")) { filedata=resultjsonobject.getString("filedata");}
			if(resultjsonobject.has("signerdata")) { signerdata=resultjsonobject.getJSONArray("signerdata");}
			if(resultjsonobject.has("signpositionData")) { signpositionData=resultjsonobject.getJSONArray("signpositionData");}

			
			EsignatureMysqlJson.put("esignatureId", "");
			EsignatureMysqlJson.put("templatename", documentname);//template name has to change inside method as in case of dynamic document it will come from rule
			EsignatureMysqlJson.put("datasourcename", "");
			EsignatureMysqlJson.put("mailtemplatename", "");
			EsignatureMysqlJson.put("deliverymethod", "");
			EsignatureMysqlJson.put("esignature_xid", "");//currently blank has to update in next  
			EsignatureMysqlJson.put("customerId", email);
			EsignatureMysqlJson.put("groupname", group);
			EsignatureMysqlJson.put("slingdocumentpath", "");////currently blank has to update in next 
			EsignatureMysqlJson.put("status", "0");
			EsignatureMysqlJson.put("extra1", "");
			EsignatureMysqlJson.put("extra2", "");
			EsignatureMysqlJson.put("extra3", "");
			EsignatureMysqlJson.put("extra4", "");
			EsignatureMysqlJson.put("extra5", "");

			

			
			 if( !isNullString(email) ){
				 
				 FreeTrialandCart cart= new FreeTrialandCart();
	    		 String freetrialstatus=cart.checkfreetrial(email);
	    		 out.println("freetrialstatus "+freetrialstatus);
	    		  serviceidNode = cart.grtServiceidnode(freetrialstatus, email, session, response);
	    		  out.println("serviceidNode "+serviceidNode);
	    		 if(serviceidNode!=null) {
	    			 
	    			 if(serviceidNode.hasNode(group)){
	    				 groupnode=serviceidNode.getNode(group);
	    				 }
	    			 if(groupnode!=null) {
	    			 
	    			 int EsignatureModulecount=0;
	    			 if(groupnode.hasNode("ESignatureMoodule")) {
	    				 EsignatureModule=groupnode.getNode("ESignatureMoodule");
	    				 EsignatureModulecount=(int) EsignatureModule.getProperty("EsignatureModulecount").getLong();
	    			 }else {
	    				 EsignatureModule=groupnode.addNode("ESignatureMoodule");
	    				 EsignatureModulecount= (int) EsignatureModule.setProperty("EsignatureModulecount", EsignatureModulecount).getLong();
	    			 }
	    			 out.println("EsignatureModule  "+EsignatureModule);
	    			 out.println("EsignatureModulecount  "+EsignatureModulecount);

	    			 if(EsignatureModule.hasNode(EsignatureModulecount+"")) {
	    			  EsignatureModulecountNode=EsignatureModule.getNode(EsignatureModulecount+"");
	    			 }else {
	    				 EsignatureModulecountNode=EsignatureModule.addNode(EsignatureModulecount+"");
	    			 }
	    			 out.println("EsignatureModulecountNode "+EsignatureModulecountNode);
	    			 EsignatureModulecountNode.setProperty("documentname", documentname);
	    			 EsignatureModule.setProperty("EsignatureModulecount", EsignatureModulecount+1);

	  //save file==============================
						if(EsignatureModulecountNode.hasNode("TemplateFile")) {
							TemplateFile=	EsignatureModulecountNode.getNode("TemplateFile");
							TemplateFile.remove();
							TemplateFile=	EsignatureModulecountNode.addNode("TemplateFile");
						}else {
							TemplateFile=	EsignatureModulecountNode.addNode("TemplateFile");
						}
						

						String ext="";
						if(filename.contains(".")) {
						 ext=filename.substring(filename.lastIndexOf(".")+1);
						}
						filename=documentname+"."+ext;
						
						 /*url =   "http://" + request.getServerName() + ":8082"
								 + request.getContextPath()
								+ serviceidNode.getPath()+"/ESignatureMoodule/"+EsignatureModulecountNode.getName()+"/TemplateFile" + "/File/"  + filename;*/
						
						url = "http://" + request.getServerName() + ":8082"
								+ request.getContextPath()
								+EsignatureModulecountNode.getPath()+"/TemplateFile" + "/File/" + filename;
						
						EsignatureModulecountNode.setProperty("DocumentUrl", url);
						 out.println("filename "+filename);
						 out.println("url "+url);
						 
						 try {
						 
							byte[] bytes = Base64.decode(filedata);
							InputStream myInputStream = new ByteArrayInputStream(bytes);

							Node subfileNode = null;
							Node fileNamenode=null;
							Node jcrNode1 = null;
							if (!TemplateFile.hasNode("File")) {
								fileNamenode = TemplateFile.addNode("File");
								fileNamenode.setProperty("file_url", url);
							//	URLEncoder.encode(query, "UTF-8")
							} else {
								fileNamenode = TemplateFile.getNode("File");
								fileNamenode.setProperty("file_url", url);
								fileNamenode.remove();
								fileNamenode = TemplateFile.addNode("File");
								fileNamenode.setProperty("file_url", url);
							}
							// if (!fileName.hasNode(name)) {
							subfileNode = fileNamenode.addNode(filename, "nt:file");
							jcrNode1 = subfileNode.addNode("jcr:content", "nt:resource");
							jcrNode1.setProperty("jcr:data", myInputStream);
//							jcrNode1.setProperty("jcr:mimeType", "attach");
							jcrNode1.setProperty("jcr:mimeType","application/octet-stream");
							
						 }catch(Exception e) {e.printStackTrace(out);
							 out.println(e.getMessage());}
	 //================================
	//save signer list	==============	
							int signercount= 0;

							if(EsignatureModulecountNode.hasNode("signerdata")) {
								signerdataNode=EsignatureModulecountNode.getNode("signerdata");
								signerdataNode.remove();
								signerdataNode=EsignatureModulecountNode.addNode("signerdata");
								 signerdataNode.setProperty("signerdata", signercount);
							}else {								
								signerdataNode=EsignatureModulecountNode.addNode("signerdata");
								 signerdataNode.setProperty("signerdata", signercount);
                                  }
						    
							out.print("signerdataNode "+signerdataNode);
							
							JSONArray Nodesignersarray = new JSONArray();
							JSONObject subNodesignersarray=null;

							if(signerdata!=null && signerdata.length()>0 && signpositionData!=null &&  signpositionData.length()>0) {
                     for(int i=0; i<signerdata.length(); i++) {
                    	 if(i<signpositionData.length()) {
                    		 JSONObject onesignpositionData= signpositionData.getJSONObject(i);
                    		 String page_no="";
                    		 String signing_point_end_x="";
                    		 String signing_point_end_y="";
                    		 String signing_point_start_x="";
                    		 String signing_point_start_y="";
                    		 String signorder="";
                    		 
                    		 String accesscode="";
                    		 String companyanme="";
                    		 String emailid="";
                    		 String note="";
                    		 
                    		 
                    		 if(onesignpositionData.has("page_no")) {page_no=onesignpositionData.getString("page_no");}
                    		 if(onesignpositionData.has("signing_point_end_x")) {signing_point_end_x=onesignpositionData.getString("signing_point_end_x");}
                    		 if(onesignpositionData.has("signing_point_end_y")) {signing_point_end_y=onesignpositionData.getString("signing_point_end_y");}
                    		 if(onesignpositionData.has("signing_point_start_x")) {signing_point_start_x=onesignpositionData.getString("signing_point_start_x");}
                    		 if(onesignpositionData.has("signing_point_start_y")) {signing_point_start_y=onesignpositionData.getString("signing_point_start_y");}
                    		 if(onesignpositionData.has("signorder")) {signorder=onesignpositionData.getString("signorder");}
                    		 signerdata.getJSONObject(i).put("page_no",page_no );
                    		 signerdata.getJSONObject(i).put("signing_point_end_x",signing_point_end_x );
                    		 signerdata.getJSONObject(i).put("signing_point_end_y",signing_point_end_y );
                    		 signerdata.getJSONObject(i).put("signing_point_start_x", signing_point_start_x);
                    		 signerdata.getJSONObject(i).put("signing_point_start_y", signing_point_start_y );
                    		 signerdata.getJSONObject(i).put("signorder", signorder);
                    		 
                    		 if(signerdata.getJSONObject(i).has("accesscode")) {accesscode=signerdata.getJSONObject(i).getString("accesscode");}
                    		 if(signerdata.getJSONObject(i).has("companyanme")) {companyanme=signerdata.getJSONObject(i).getString("companyanme");}
                    		 if(signerdata.getJSONObject(i).has("emailid")) {emailid=signerdata.getJSONObject(i).getString("emailid");}
                    		 if(signerdata.getJSONObject(i).has("note")) {note=signerdata.getJSONObject(i).getString("note");}

                    		 signeremailarraylist.put(emailid);
                    		 
                    		 //create json for 5th api
             				subNodesignersarray=new JSONObject();
            				subNodesignersarray.put("page_no", page_no);
            				subNodesignersarray.put("signing_point_start_x", signing_point_start_x);
            				subNodesignersarray.put("signing_point_start_y", signing_point_start_y);
            				subNodesignersarray.put("signing_point_end_x", signing_point_end_x);
            				subNodesignersarray.put("signing_point_end_y", signing_point_end_y);
            				subNodesignersarray.put("is_request_sign", "1");
            				subNodesignersarray.put("language", "en");


            				subNodesignersarray.put("email", emailid);
            				subNodesignersarray.put("access_code", accesscode);
            				String name_nm="";
            				out.println("space");
            				out.println("emailid: "+emailid);
            				if(emailid.lastIndexOf("@")!=-1){
            					out.println("emailidinside: "+emailid);
            					name_nm=emailid.substring(0,emailid.lastIndexOf("@"));
            					out.println("emailidafter: "+emailid);
							}
            				
            				subNodesignersarray.put("name_nm", name_nm);
            				subNodesignersarray.put("comment", note);
            				subNodesignersarray.put("is_send_mail", "1");
            				subNodesignersarray.put("document_type", "3");
            				subNodesignersarray.put("organize_nm", companyanme);
							Nodesignersarray.put(subNodesignersarray);

                    		 
                    		 
                    		 onesignerNode =signerdataNode.addNode(signercount+"");
                    		 Iterator itr =signerdata.getJSONObject(i).keys();
                    		 while(itr.hasNext()) {
                    			 String key =(String) itr.next();
                    			 String value =signerdata.getJSONObject(i).getString(key);
                    			 onesignerNode.setProperty(key, value);
                    		 }
                    		 signercount++;
                    	 }
                            }	
                     signerdataNode.setProperty("signercount", signercount);
								
							}	
							out.println("signerdata  "+signerdata);
							
							session.save();

	    //signerdata end==================================================================================
							
							
// call esignapi=========================================================================================							
	//1.create
	//2.accesstoken
	//3.xid
	//4.documentdata
	//5.position
	//mysql save
							
	//createjsonfor 5th	step	
		
	out.println("Nodesignersarray "+Nodesignersarray);
	String Xid = null;
	try {
		EsignatureMysqlJson.put("templatename", documentname);
		EsignatureMysqlJson.put("slingdocumentpath", EsignatureModulecountNode.getPath());////currently blank has to update in next 

		JSONArray SenderSignedStatus = new JSONArray();
		JSONObject subSenderSignedStatus = null;
			// out.println("Nodesignersarray "+Nodesignersarray);

			String access_token = null;
			JSONObject documentuploadresp = null;
			String documentinfostatus = null;
			String Signature_position_settingresp=null;
			String documentinfostatusfinal=null;
			JSONArray  partner_document_token =null;

			ESignServics esignServics = new ESignServics();

			String creatstatus = esignServics.Create_token_generation();
			 out.println("creatstatus "+creatstatus);
			if (creatstatus.equalsIgnoreCase("true")) {
				access_token = esignServics.Access_token_generation();
				 out.println("access_token "+access_token);
				if (access_token != null) {
					Xid = esignServics.Transaction_ID_acquisition(access_token);
					 out.println("Xid "+Xid);
					EsignatureMysqlJson.put("esignature_xid", Xid);
					
					if (Xid != null) {
						documentuploadresp = esignServics.Document_upload(access_token, Xid,
								url);
						out.println("documentuploadresp "+documentuploadresp);
						if (documentuploadresp != null && documentuploadresp.has("status")
								&& documentuploadresp.getString("status").equalsIgnoreCase("0")) {
							documentinfostatus = esignServics.Document_information_registration(
									access_token, Xid, filename, "", "Doctiger",
									new JSONArray(), "3", "2");
							 out.println("documentinfostatus "+documentinfostatus);
							if (documentinfostatus.equalsIgnoreCase("0")) {
								JSONObject finalesignobj = new JSONObject();
								finalesignobj.put("access_token", access_token);
								finalesignobj.put("xid", Xid);
								finalesignobj.put("own_name_nm", "");
								finalesignobj.put("own_organize_nm", "");
								finalesignobj.put("is_signing_field", "1");
								finalesignobj.put("partner_signing_field", Nodesignersarray);
								out.println("finalesignobj "+finalesignobj);

								Signature_position_settingresp = esignServics.Signature_position_setting(finalesignobj);
								
								out.println("Signature_position_setting resp   "+Signature_position_settingresp);
								if(isJSONValid(Signature_position_settingresp)) {
									JSONObject respobj = new JSONObject(Signature_position_settingresp);
									if(respobj.has("status") && respobj.getString("status").equals("0")) {
										documentinfostatusfinal="0";
										if(respobj.has("result") && respobj.getJSONObject("result").has("partner_document_token")) {
											partner_document_token=respobj.getJSONObject("result").getJSONArray("partner_document_token");
											if(partner_document_token!=null) {
											for(int pt=0; pt<partner_document_token.length(); pt++) {
												JSONObject sub_partner_document_token=partner_document_token.getJSONObject(pt);
												subSenderSignedStatus=new JSONObject();
												if(sub_partner_document_token.has("document_token")) {subSenderSignedStatus.put("document_token", sub_partner_document_token.getString("document_token"));}
												else {subSenderSignedStatus.put("document_token", "");}
							
//												if(sub_partner_document_token.has("name_nm")) {subSenderSignedStatus.put("senderEmail_Id", sub_partner_document_token.getString("name_nm"));}
//												else {subSenderSignedStatus.put("senderEmail_Id", "");}
//												
												if(signeremailarraylist.length()>pt) {
													subSenderSignedStatus.put("senderEmail_Id", signeremailarraylist.getString(pt));
													}
												subSenderSignedStatus.put("status_id", "");
												subSenderSignedStatus.put("esignature_xid", Xid);//update below
												subSenderSignedStatus.put("status", "0");
												subSenderSignedStatus.put("extra1", "");
												subSenderSignedStatus.put("extra2", "");
												subSenderSignedStatus.put("extra3", "");
												subSenderSignedStatus.put("extra4", "");
												subSenderSignedStatus.put("extra5", "");
												//out.println("subSenderSignedStatus  "+subSenderSignedStatus);
												SenderSignedStatus.put(subSenderSignedStatus);
											}
											}
										}
									}
								}
								EsignatureMysqlJson.put("SenderSignedStatus", SenderSignedStatus);
								out.println("EsignatureMysqlJson  "+EsignatureMysqlJson);

								EsignatureModulecountNode.setProperty("xid", Xid);
								EsignatureModulecountNode.setProperty("status", "0");

								session.save();
								
								
								remindersigApi(EsignatureMysqlJson.toString());
							}
						}
					}
				}
			}
		
	} catch (Exception e) {
		out.println("sign eerror " + e.getMessage());
	}
	
	
							
							
//=======================================================================================================							
	    		 
	    		 
	    		 }}
			 }
		} catch (Exception e) {
			e.printStackTrace(out);
		}
	}
	
	public static boolean isNullString (String p_text){
		if(p_text != null && p_text.trim().length() > 0 && !"null".equalsIgnoreCase(p_text.trim())){
			return false;
		}
		else{
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
	public static String remindersigApi(String jsondata) {
		String count=null;
		try {
		//http://35.231.202.149:8095
		     ignoreHttps("http://uk.bluealgo.com:8085/HtmlDoc/SaveEsignatureFullData_standalone");

		URL obj = new URL("http://uk.bluealgo.com:8085/HtmlDoc/SaveEsignatureFullData_standalone");
		HttpURLConnection postConnection = (HttpURLConnection) obj.openConnection();
		postConnection.setRequestMethod("POST");
		postConnection.setDoOutput(true);
		OutputStream os = postConnection.getOutputStream();
		os.write(jsondata.getBytes());
		os.flush();
		os.close();
		int responseCode = postConnection.getResponseCode();
		System.out.println("responseCode: "+responseCode +HttpURLConnection.HTTP_OK);
		if (responseCode == HttpURLConnection.HTTP_OK) { // success
		BufferedReader in = new BufferedReader(new InputStreamReader(postConnection.getInputStream()));
		String inputLine;
		StringBuffer response = new StringBuffer();
		while ((inputLine = in.readLine()) != null) {
		response.append(inputLine);
		count=response.toString();
		}
		System.out.println("count: "+count);
		in.close();

		} 
		} catch (Exception e) {
			e.printStackTrace();
		return "false";
		}
		return "true";

		}
	   public static void ignoreHttps(String urlstring){
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