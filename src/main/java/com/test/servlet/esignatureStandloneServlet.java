package com.test.servlet;

import java.io.IOException;
import java.io.PrintWriter;

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
import org.apache.sling.jcr.api.SlingRepository;


//import com.sun.jersey.core.util.Base64;

@Component(immediate = true, metatype = false)
@Service(value = javax.servlet.Servlet.class)
@Properties({ @Property(name = "service.description", value = "Save product Servlet"),
		@Property(name = "service.vendor", value = "VISL Company"),
		@Property(name = "sling.servlet.paths", value = { "/servlet/service/sigstandlone" }),
		@Property(name = "sling.servlet.resourceTypes", value = "sling/servlet/default"),
		@Property(name = "sling.servlet.extensions", value = { "hotproducts", "cat", "latestproducts", "brief",
				"prodlist", "catalog", "viewcart", "productslist", "addcart", "createproduct", "checkmodelno",
				"productEdit" }) })
@SuppressWarnings("serial")
public class esignatureStandloneServlet extends SlingAllMethodsServlet {

	@Reference
	private SlingRepository repo;

	// static ResourceBundle bundleststic = ResourceBundle.getBundle("config_SKU1");

	// @Reference
	// private ParseSlingData parseSlingData;
	// ParseSlingData parseSlingData= new ParseSlingDataImpl();
	@Override
	protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response)
			throws ServletException, IOException {
		PrintWriter out = response.getWriter();
		try {

			Session session = null;
			session = repo.login(new SimpleCredentials("admin", "admin".toCharArray()));
			// Node content = session.getRootNode().getNode("content");
			
  			RequestDispatcher dis= request.getRequestDispatcher("/content/static/.sigstandloneesp");

  			dis.forward(request, response);

		}catch(Exception e) {e.printStackTrace();}
	}

}


