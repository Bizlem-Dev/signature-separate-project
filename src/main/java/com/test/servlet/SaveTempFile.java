package com.test.servlet;


import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.cert.X509Certificate;
import java.util.Calendar;
import java.util.Date;

import javax.jcr.Node;
import javax.jcr.Session;
import javax.jcr.SimpleCredentials;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.servlet.ServletException;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.commons.json.JSONArray;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.apache.sling.jcr.api.SlingRepository;

import com.service.impl.GetAllMethodsHere;
import com.sun.jersey.core.util.Base64;

import jdk.nashorn.internal.ir.annotations.Ignore;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import javax.imageio.ImageIO;
import java.util.List;
import java.awt.image.BufferedImage;


@SuppressWarnings("serial")
@Component(immediate = true, metatype = false)
@Service(value = javax.servlet.Servlet.class)
@Properties({ @Property(name = "service.description", value = "Prefix Test Servlet Minus One"),
		@Property(name = "service.vendor", value = "The Apache Software Foundation"),
		@Property(name = "sling.servlet.paths", value = { "/servlet/service/FileUploadedStandardSaveData" }),
		@Property(name = "sling.servlet.extensions", value = { "addAccount", "account", "success", "ajax", "newBlog",
				"ajaxBlog", "searchBlog", "search", "following", "follower", "userContent", "userPost", "userDraft",
				"userQueue", "home", "menu", "likeBlog", "deleteBlog", "tagSearch", "followerSearch", "edit",
				"viewBlog", "tagPosts", "blogSearch", "deleteBlogId", "deleteAccount", "confirmAccount", "confirmBlog",
				"randomBlog" })

})
public class SaveTempFile extends SlingAllMethodsServlet {


	@Reference
	private SlingRepository repo;
	 private static final String FILE_TO = "/home/ubuntu/generationTomcat/apache-tomcat-8.5.41/webapps/ROOT/StandardSignature/";
	Session session = null;

	protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response)
			throws ServletException, IOException {
		
		PrintWriter out=response.getWriter();
	       
	       try {
			
	    	   session = repo.login(new SimpleCredentials("admin", "admin".toCharArray()));
	    	
	    	   BufferedInputStream bis = new BufferedInputStream(request.getInputStream());
	    	   ByteArrayOutputStream buf = new ByteArrayOutputStream();
	    	   int result = bis.read();

	    	   while (result != -1) {
	    	   buf.write((byte) result);
	    	   result = bis.read();
	    	   }
	    	   String res = buf.toString("UTF-8");
	    	   JSONObject resultjsonobject=new JSONObject(res);
	    	   
	    	   
	    	   String email="";
	    	   String filenameNodeSling="";
	    	   String filedata="";
	    	   
	    	    Calendar c = Calendar.getInstance();
				c.setTime(new Date());
				
				JSONObject js = new JSONObject();
	    	   
	    	   if(resultjsonobject.has("Email")){
	    		   email=resultjsonobject.getString("Email");
	    	   }if(resultjsonobject.has("filename")) {
					filenameNodeSling = resultjsonobject.getString("filename");
				}if(resultjsonobject.has("filedata")) {
					filedata = resultjsonobject.getString("filedata");
				}
				
	    	   GetAllMethodsHere GAMH =new GetAllMethodsHere(email, session, response);
	    	   Node userEmailNode= GAMH.freeTrialCheck();
	    	   
	    	   if( userEmailNode!=null ){
	    		   
	    		   if( !GetAllMethodsHere.isNullString(filenameNodeSling) ){
	    		   
	    		   if (userEmailNode.getPath().toString().contains("freetrial")) {
	    			   
	    			   byte[] bytes = Base64.decode(filedata);
	    			   InputStream myInputStream = new ByteArrayInputStream(bytes);
	    			   File filepath = new File(FILE_TO);
	    			   
	    			   if (!filepath.exists()) {
	    				   filepath.mkdir();
	 			           
	 			        }
	    			   if (filepath.exists()) {
	    				   
	    				   File filepathplusname = new File(FILE_TO+filenameNodeSling);
	    				   String message= GAMH.copyInputStreamToFile(myInputStream, filepathplusname);
		    			   
	    				   if( !GetAllMethodsHere.isNullString(message) ){
	    					   
	    					   if( message.equalsIgnoreCase("success") ){
	    						  // String url="http://uk.bluealgo.com:8085/StandardSignature/"+filenameNodeSling;
	    						   
                                   String arrayStr="";
	    						   
	    						   if(filenameNodeSling.contains("pdf")){ // for pdf to images
	    							   arrayStr= pdfToImages(FILE_TO, filenameNodeSling);
	    						   }else{
	    							    arrayStr=checkWordToPdfApi(filenameNodeSling);   // for doc and docx images
	    						   }
	    						   
	    						   js.put("status", "success");
	    						   js.put("imageArray", arrayStr);
	    						   out.println(js);
	    					   }
	    					   
	    				   }else{
	    					   js.put("status", "error");
	    						js.put("message", "file name should not be blank");
	    						out.println(js);
	    				   }
	    				   
	    			   }
	    			  
	    			   
	    		   } // freetrial check here
	    		   else{
	    			   
	    			   byte[] bytes = Base64.decode(filedata);
	    			   InputStream myInputStream = new ByteArrayInputStream(bytes);
	    			   File filepath = new File(FILE_TO);
	    			   
	    			   if (!filepath.exists()) {
	    				   filepath.mkdir();
	 			           
	 			        }
	    			   if (filepath.exists()) {
	    				   
	    				   File filepathplusname = new File(FILE_TO+filenameNodeSling);
                           String message= GAMH.copyInputStreamToFile(myInputStream, filepathplusname);
		    			   
	    				   if( !GetAllMethodsHere.isNullString(message) ){
	    					   
	    					   if( message.equalsIgnoreCase("success") ){
	    						  // String url="http://uk.bluealgo.com:8085/StandardSignature/"+filenameNodeSling;
	    						   
	    						   String arrayStr="";
	    						   
	    						   if( filenameNodeSling.contains("pdf") || filenameNodeSling.contains("PDF") ){ // for pdf to images
	    							   arrayStr= pdfToImages(FILE_TO, filenameNodeSling);
	    						   }else{
	    							    arrayStr=checkWordToPdfApi(filenameNodeSling);   // for doc and docx images
	    						   }
	    						   
	    						   js.put("status", "success");
	    						   js.put("imageArray", arrayStr);
	    						   out.println(js);
	    					   }
	    					   
	    				   }else{
	    					   js.put("status", "error");
	    						js.put("message", "file name should not be blank");
	    						out.println(js);
	    				   }
	    			   }
	    			   
	    		   } // shopping end here
	    		   
	    	   }
	    		   
	    	   } // userEmailNode blank check
	    	   else {
					js.put("status", "error");
					js.put("message", "Invalid user");
					out.println(js);
				}
	    	   
	    	   
	    	   
		} catch (Exception e) {
			e.printStackTrace(out);
		}

		

	}

	protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response)
			throws ServletException, IOException {
		
	}
	
	public static String checkWordToPdfApi(String fileNamePlusExtension) {
	      String count=null;
			try {
				ignoreHttps("http://uk.bluealgo.com:8085/HtmlDoc/StandardSignatureServlet");
				URL obj = new URL("http://uk.bluealgo.com:8085/HtmlDoc/StandardSignatureServlet");
				HttpURLConnection postConnection = (HttpURLConnection) obj.openConnection();
				postConnection.setRequestMethod("POST");
				postConnection.setDoOutput(true);
				OutputStream os = postConnection.getOutputStream();
				os.write(fileNamePlusExtension.getBytes());
				os.flush();
				os.close();
				int responseCode = postConnection.getResponseCode();
				if (responseCode == HttpURLConnection.HTTP_OK) { // success
					BufferedReader in = new BufferedReader(new InputStreamReader(postConnection.getInputStream()));
					String inputLine;
					StringBuffer response = new StringBuffer();
					while ((inputLine = in.readLine()) != null) {
						response.append(inputLine);
						count=response.toString();
					}
					in.close();
					
				} 

			} catch (Exception e) {
				return count;
			}
			return count;

		}
	
	public static String pdfToImages(String FilePath, String filenameplusextension){
		String arrayStr="";
		JSONArray arrayObj=new JSONArray();
		try {
			
			    String fileName = filenameplusextension.substring(0,filenameplusextension.lastIndexOf("."));
			
	            PDDocument document = PDDocument.load(FilePath+filenameplusextension);
	            List<PDPage> list = document.getDocumentCatalog().getAllPages();

//	            int pageNumber = 0;
	            
//	            for (PDPage page : list) {
	            
	            for(int pageNumber=0;pageNumber<list.size();pageNumber++){
	            
	            	PDPage page=list.get(pageNumber);
	            	
	            	JSONObject jsonObj=new JSONObject();
	                BufferedImage image = page.convertToImage();
	                
	                File outputfile = new File(FilePath + fileName +"_"+ pageNumber +".jpeg");
	                ImageIO.write(image, "jpeg", outputfile);
//	                pageNumber++;
	                
	                jsonObj.put("fileName", fileName + "_" + pageNumber + ".jpeg");
	                jsonObj.put("filePath", FilePath);
	                jsonObj.put("pageNo", pageNumber);
	                
	                String imageSaveFilePath = FilePath + fileName +"_"+ pageNumber +".jpeg"; 
	                
	                if(imageSaveFilePath.lastIndexOf("/")!=-1){
	        			String before = imageSaveFilePath.substring(0, imageSaveFilePath.lastIndexOf("/"));
	        			
	        			if(before!=""){
	        				if(before.lastIndexOf("/")!=-1){
	        					String after = before.substring(before.lastIndexOf("/")+1);
	        					
	        					imageSaveFilePath="http://uk.bluealgo.com:8085/"+after+"/"+fileName + "_" + pageNumber + ".jpeg";
	        					jsonObj.put("filePathplusfilename", imageSaveFilePath);
	        				}
	        			}
	        			
	        		}
	                
	                
	                arrayObj.put(jsonObj);
	                arrayStr=arrayObj.toString();
	                
	            } // for close
	            document.close();
	            list.clear();
			
		} catch (Exception e) {
			JSONObject errorObj=new JSONObject();
			try {
				errorObj.put("error", e.getMessage());
			} catch (JSONException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			 arrayObj.put(errorObj);
			 arrayStr=arrayObj.toString();
		}
		
		return arrayStr;
		
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
