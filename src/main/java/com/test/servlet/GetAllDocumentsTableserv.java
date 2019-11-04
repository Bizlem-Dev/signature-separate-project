package com.test.servlet;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;

import javax.jcr.Node;
import javax.jcr.Session;
import javax.jcr.SimpleCredentials;
import javax.servlet.RequestDispatcher;
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

import com.service.impl.ESignServics;
import com.service.impl.SOAPCall;



//import com.sun.jersey.core.util.Base64;

@Component(immediate = true, metatype = false)
@Service(value = javax.servlet.Servlet.class)
@Properties({ @Property(name = "service.description", value = "Save product Servlet"),
		@Property(name = "service.vendor", value = "VISL Company"),
		@Property(name = "sling.servlet.paths", value = { "/servlet/service/getalldocument" }),
		@Property(name = "sling.servlet.resourceTypes", value = "sling/servlet/default"),
		@Property(name = "sling.servlet.extensions", value = { "hotproducts", "cat", "latestproducts", "brief",
				"prodlist", "catalog", "viewcart", "productslist", "addcart", "createproduct", "checkmodelno",
				"productEdit" }) })
@SuppressWarnings("serial")
public class GetAllDocumentsTableserv extends SlingAllMethodsServlet {

	@Reference
	private SlingRepository repo;

	@Override
	protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response)
			throws ServletException, IOException {
		PrintWriter out = response.getWriter();
		//out.println("in serv");
		String email="";
		String group="";
		JSONArray arr =null;
		JSONObject obj=null;
		JSONObject dataobj = new JSONObject();
		
		
		String slingdocumentpath=null;
		String DocumentUrl=null;
		String SignedDocumentUrl=null;
		
		Node slingdocumentpathNode=null;
		try {
              email=request.getParameter("email");
              group=request.getParameter("group");
      		//out.println("email "+email+"group "+group);

			Session session = null;
			session = repo.login(new SimpleCredentials("admin", "admin".toCharArray()));

			
			 String alldocumentres= new SOAPCall().callGet("http://uk.bluealgo.com:8085/HtmlDoc/Alldocument_table?email="+email+"&group="+group);
            //out.println("alldocumentres "+alldocumentres);
			if(isJSONValid(alldocumentres)) {
				arr= new JSONArray(alldocumentres);
				//out.println("arr "+arr);
				for(int i=0; i<arr.length();i++) {
					obj= arr.getJSONObject(i);
					//out.println("obj "+obj);

					if(obj.has("slingdocumentpath")) {slingdocumentpath=obj.getString("slingdocumentpath");}
					//out.println("slingdocumentpath "+slingdocumentpath);
					slingdocumentpathNode=session.getNode(slingdocumentpath);
					//out.println("slingdocumentpathNode "+slingdocumentpathNode);

					if(slingdocumentpathNode!=null) {
						if(slingdocumentpathNode.hasProperty("DocumentUrl")) {
							DocumentUrl=slingdocumentpathNode.getProperty("DocumentUrl").getString();
							//out.println("DocumentUrl "+DocumentUrl);
							arr.getJSONObject(i).put("DocumentUrl", DocumentUrl);
						}
						if(slingdocumentpathNode.hasProperty("SignedDocumentUrl")) {
							SignedDocumentUrl=slingdocumentpathNode.getProperty("SignedDocumentUrl").getString();
							//out.println("SignedDocumentUrl "+SignedDocumentUrl);
							arr.getJSONObject(i).put("SignedDocumentUrl", SignedDocumentUrl);
						}
					}
				}
				
				
			}
			dataobj.put("data", arr);
			out.println(dataobj);
		}catch(Exception e) {
			e.printStackTrace(out);}
	}
	
	protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response)
			throws ServletException, IOException {
		Session session = null;
		ESignServics esignServics = new ESignServics();
        String access_token ="";
		String email=null;
		String group=null;
		String xid=null;
		String nodepath=null;
		JSONObject return_obj = new JSONObject();
String resp=null;
JSONObject esignserviceapijson=null;
		PrintWriter out = response.getWriter();
		String status="";
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
			JSONObject resultjsonobject = new JSONObject(res);
			out.println("resultjsonobject "+resultjsonobject);
			
			if (request.getRequestPathInfo().getExtension().equals("sendreminder")) {
				xid=resultjsonobject.getString("esignature_xid");
				 status= new SOAPCall().callGet("http://uk.bluealgo.com:8085/HtmlDoc/sendReminderByXid?xid="+xid);
				 
				 if(status.equals("true")) {
					 return_obj.put("status", status);
				 }
				//out.println(status);
			}		
	}catch(Exception e) {
		e.printStackTrace(out); 
		status="false";
		 try {
			return_obj.put("status", status);
		} catch (JSONException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

	}
		out.println(return_obj);

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
}


