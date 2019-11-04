package com.service.impl;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.cert.X509Certificate;
import java.util.ResourceBundle;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Session;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.apache.commons.codec.binary.Base64;
import org.apache.felix.scr.annotations.Reference;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.commons.json.JSONArray;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.apache.sling.jcr.api.SlingRepository;

public class FreeTrialandCart {
	// ResourceBundle bundle = ResourceBundle.getBundle("config");
	static ResourceBundle bundleststic = ResourceBundle.getBundle("config_EsignatureModule");

	@Reference
	private SlingRepository repo;

	// Session session = null;
	Base64 base64 = new Base64();

	public static void main(String[] args) throws JSONException {
		String a = "[\"name\",\"aaddr\",\"city\"]";
		JSONArray fieldslist = new JSONArray(a);
		String a1 = new FreeTrialandCart().checkfreetrial("salesautoconvertuser1@gmail.com");
		System.out.println("a1 " + a1);

		// String a1=getWordToPdfData();
		// System.out.println(a1);

		// new FreeTrialandCart().createExcel(fieldslist, "abcdefghi");
		// "mohit.raj@bizlem.com"
	}



	public String checkfreetrial(String userid) {
		int expireFlag = 0;
		if (userid.equalsIgnoreCase("viki@gmail.com") || userid.equalsIgnoreCase("nilesh@gmail.com")) {
			System.out.println("userid " + userid);
			expireFlag = 1;
		}
		String addr = bundleststic.getString("Freetrialurl") + userid + "/DocTigerFreeTrial";
		//String addr = bundleststic.getString("Freetrialurl") + userid + "/leadautoconvertfreetrial";

		// String addr =
		// "http://dev.uk.bluealgo.com:8086/apirest/trialmgmt/trialuser/"+userid+"/DocTigerFreeTrial";
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

			/*
			 * if (obj.has("expireFlag")) { expireFlag = obj.getInt("expireFlag");
			 * System.out.println(expireFlag); } else { expireFlag = 1; }
			 */

			if (obj.has("freetrial")) {
				expireFlag = obj.getInt("freetrial");
				System.out.println(expireFlag);
			} else {
				expireFlag = 1;
			}

			conn.disconnect();
		} catch (Exception ex) {

			System.out.println(ex.getMessage());
			expireFlag = 1;

		}
		return expireFlag + "";
		// return "1";

	}

	public Node getDocTigerAdvNode(String freetrialstatus, String email, String group, Session session1,
			SlingHttpServletResponse response) {

		// freetrialstatus="0";
		PrintWriter out = null;
		// out.println("in getDocTigerAdvNode");

		Node contentNode = null;
		Node appserviceNode = null;
		Node appfreetrialNode = null;
		Node emailNode = null;
		Node DoctigerAdvNode = null;

		Node adminserviceidNode = null;
		String adminserviceid = "";
		try {
			out = response.getWriter();

			// out.println("in method ");
			// out.println("email "+email);

			// session = repo.login(new SimpleCredentials("admin", "admin".toCharArray()));
			if (session1.getRootNode().hasNode("content")) {
				contentNode = session1.getRootNode().getNode("content");
			} else {
				contentNode = session1.getRootNode().addNode("content");
			}
			// out.println("contentNode "+contentNode);

			if (freetrialstatus.equalsIgnoreCase("0")) {

				if (contentNode.hasNode("services")) {
					appserviceNode = contentNode.getNode("services");

					// out.println("appserviceNode "+appserviceNode);

					if (appserviceNode.hasNode("freetrial")) {
						appfreetrialNode = appserviceNode.getNode("freetrial");

						// out.println("appfreetrialNode "+appfreetrialNode);

						if (appfreetrialNode.hasNode("users")
								&& appfreetrialNode.getNode("users").hasNode(email.replace("@", "_"))) {
							emailNode = appfreetrialNode.getNode("users").getNode(email.replace("@", "_"));
							// out.println("emailNode "+emailNode);
							if (emailNode.hasNode("DocTigerAdvanced")) {
								DoctigerAdvNode = emailNode.getNode("DocTigerAdvanced");
							} else {
								DoctigerAdvNode = emailNode.addNode("DocTigerAdvanced");
							}
							// out.println("DoctigerAdvNode "+DoctigerAdvNode);

						} else {
							// emailNode=appfreetrialNode.getNode("users").addNode(email.replace("@", "_"));
						}
					} else {
						// appfreetrialNode=appserviceNode.addNode("freetrial");
					}
				} else {
					// appserviceNode=contentNode.addNode("services");
				}

			} else {

				// out.println("in else");

				if (contentNode.hasNode("user") && contentNode.getNode("user").hasNode(email.replace("@", "_"))) {
					emailNode = contentNode.getNode("user").getNode(email.replace("@", "_"));
					if (emailNode.hasNode("services") && emailNode.getNode("services").hasNode("salesautoconvert")
							&& emailNode.getNode("services").getNode("salesautoconvert").hasNodes()) {
						NodeIterator itr = emailNode.getNode("services").getNode("salesautoconvert").getNodes();
						while (itr.hasNext()) {
							adminserviceid = itr.nextNode().getName();
							if (!adminserviceid.equalsIgnoreCase("LeadAutoConvFrTrial")) {
								if ((adminserviceid != "") && (!adminserviceid.equals("LeadAutoConvFrTrial"))) {

									if (contentNode.hasNode("services")) {
										appserviceNode = contentNode.getNode("services");
									} else {
										appserviceNode = contentNode.addNode("services");
									}
									// out.println("appserviceNode "+appserviceNode);

									if (appserviceNode.hasNode(adminserviceid)) {
										appfreetrialNode = appserviceNode.getNode(adminserviceid);

										if (appfreetrialNode.hasNode(group)) {
											emailNode = appfreetrialNode.getNode(group);
										} else {
											emailNode = appfreetrialNode.addNode(group);
										}
										// out.println("emailNode "+emailNode);
										if (emailNode.hasNode("DocTigerAdvanced")) {
											DoctigerAdvNode = emailNode.getNode("DocTigerAdvanced");
										} else {
											DoctigerAdvNode = emailNode.addNode("DocTigerAdvanced");
										}
									}
									break;
								}

							}
						}
					}else
					
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
									// out.println("appserviceNode "+appserviceNode);

									if (appserviceNode.hasNode(adminserviceid)) {
										appfreetrialNode = appserviceNode.getNode(adminserviceid);

										if (appfreetrialNode.hasNode(group)) {
											emailNode = appfreetrialNode.getNode(group);
										} else {
											emailNode = appfreetrialNode.addNode(group);
										}
										// out.println("emailNode "+emailNode);
										if (emailNode.hasNode("DocTigerAdvanced")) {
											DoctigerAdvNode = emailNode.getNode("DocTigerAdvanced");
										} else {
											DoctigerAdvNode = emailNode.addNode("DocTigerAdvanced");
										}
									}
									break;
								}

							}
						}
					}
					
					
					
					
					
					
					
				}
				// out.println("adminserviceid "+adminserviceid);

			}

			// session.save();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			out.println(e.getMessage());
			DoctigerAdvNode = null;
		}

		return DoctigerAdvNode;
	}
	public Node grtServiceidnode(String freetrialstatus, String email, Session session1,
			SlingHttpServletResponse response) {

		// freetrialstatus="0";
		PrintWriter out = null;
		// out.println("in getDocTigerAdvNode");

		Node contentNode = null;
		Node appserviceNode = null;
		Node appfreetrialNode = null;
		Node emailNode = null;
		Node DoctigerAdvNode = null;

		Node adminserviceidNode = null;
		String adminserviceid = "";
		try {
			out = response.getWriter();

			// out.println("in method ");
			// out.println("email "+email);

			// session = repo.login(new SimpleCredentials("admin",
			// "admin".toCharArray()));
			if (session1.getRootNode().hasNode("content")) {
				contentNode = session1.getRootNode().getNode("content");
			} else {
				contentNode = session1.getRootNode().addNode("content");
			}
			// out.println("contentNode "+contentNode);

			if (freetrialstatus.equalsIgnoreCase("0")) {

				if (contentNode.hasNode("services")) {
					appserviceNode = contentNode.getNode("services");

					// out.println("appserviceNode "+appserviceNode);

					if (appserviceNode.hasNode("freetrial")) {
						appfreetrialNode = appserviceNode.getNode("freetrial");

						// out.println("appfreetrialNode "+appfreetrialNode);

						if (appfreetrialNode.hasNode("users")
								&& appfreetrialNode.getNode("users").hasNode(email.replace("@", "_"))) {
							emailNode = appfreetrialNode.getNode("users").getNode(email.replace("@", "_"));
							// out.println("emailNode "+emailNode);
							appfreetrialNode = emailNode;
							// out.println("DoctigerAdvNode "+DoctigerAdvNode);

						} else {
							// emailNode=appfreetrialNode.getNode("users").addNode(email.replace("@",
							// "_"));
						}
					} else {
						// appfreetrialNode=appserviceNode.addNode("freetrial");
					}
				} else {
					// appserviceNode=contentNode.addNode("services");
				}

			} else {

				// out.println("in else");

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
									// out.println("appserviceNode
									// "+appserviceNode);

									if (appserviceNode.hasNode(adminserviceid)) {
										appfreetrialNode = appserviceNode.getNode(adminserviceid);

									}

									break;
								}

							}
						}
					}else
					
					if (emailNode.hasNode("services") && emailNode.getNode("services").hasNode("salesautoconvert")
							&& emailNode.getNode("services").getNode("salesautoconvert").hasNodes()) {
					//specific only for  salesautoconvert productcode 	=======
						NodeIterator itr = emailNode.getNode("services").getNode("salesautoconvert").getNodes();
						while (itr.hasNext()) {
							adminserviceid = itr.nextNode().getName();
							if (!adminserviceid.equalsIgnoreCase("LeadAutoConvFrTrial")) {
								if ((adminserviceid != "") && (!adminserviceid.equals("LeadAutoConvFrTrial"))) {

									if (contentNode.hasNode("services")) {
										appserviceNode = contentNode.getNode("services");
									} else {
										appserviceNode = contentNode.addNode("services");
									}
									// out.println("appserviceNode
									// "+appserviceNode);

									if (appserviceNode.hasNode(adminserviceid)) {
										appfreetrialNode = appserviceNode.getNode(adminserviceid);
									}
									break;
								}
							}
						}
						//end===========
					}
					
				}
				// out.println("adminserviceid "+adminserviceid);

			}

			// session.save();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			out.println(e.getMessage());
			appfreetrialNode = null;
		}

		return appfreetrialNode;
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
