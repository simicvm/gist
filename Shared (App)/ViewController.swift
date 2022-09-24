//
//  ViewController.swift
//  Shared (App)
//
//  Created by Marko Simic on /915/22.
//

import WebKit

#if os(iOS)
import UIKit
typealias PlatformViewController = UIViewController
#elseif os(macOS)
import Cocoa
import SafariServices
typealias PlatformViewController = NSViewController
#endif

let extensionBundleIdentifier = "com.simicvm.gist.Extension"

let account = "openai"
let service = "api-token"

class ViewController: PlatformViewController, WKNavigationDelegate, WKScriptMessageHandler {

    @IBOutlet var webView: WKWebView!

    override func viewDidLoad() {
        super.viewDidLoad()

        self.webView.navigationDelegate = self

#if os(iOS)
        self.webView.scrollView.isScrollEnabled = false
#endif

        self.webView.configuration.userContentController.add(self, name: "controller")

        self.webView.loadFileURL(Bundle.main.url(forResource: "Main", withExtension: "html")!, allowingReadAccessTo: Bundle.main.resourceURL!)
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
#if os(iOS)
        webView.evaluateJavaScript("show('ios')")
#elseif os(macOS)
        webView.evaluateJavaScript("show('mac')")

        SFSafariExtensionManager.getStateOfSafariExtension(withIdentifier: extensionBundleIdentifier) { (state, error) in
            guard let state = state, error == nil else {
                // Insert code to inform the user that something went wrong.
                return
            }

            DispatchQueue.main.async {
                if #available(macOS 13, *) {
                    webView.evaluateJavaScript("show('mac', \(state.isEnabled), true)")
                } else {
                    webView.evaluateJavaScript("show('mac', \(state.isEnabled), false)")
                }
            }
        }
#endif
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
#if os(macOS)
        let message = message.body as! NSDictionary
        if (message["command"] as! String == "open-preferences") {
            SFSafariApplication.showPreferencesForExtension(withIdentifier: extensionBundleIdentifier) { error in
                guard error == nil else {
                    // Insert code to inform the user that something went wrong.
                    return
                }

                DispatchQueue.main.async {
                    NSApplication.shared.terminate(nil)
                }
            }
        } else if (message["command"] as! String == "api-key") {
            let auth = Data((message["api-key"] as! String).utf8)
            DispatchQueue.global().async {
                do {
                    try KeychainHelper.savePassword(password: auth, service: service, account: account)
                    print("API key set")
                } catch KeychainInterface.KeychainError.duplicateItem {
                    print("API key already exists")
                    do {
                        try KeychainHelper.updatePassword(password: auth, service: service, account: account)
                        print("API key updated")
                    } catch {
                        print("couldn't update API key")
                    }
                } catch {
                    print("Something else went wrong!")
                }
            }
        } else if (message["command"] as! String == "retrieve-api-key") {
            do {
                let apiKey = try KeychainHelper.readPassword(service: service, account: account)
                let apiKeyString = String(data: apiKey, encoding: .utf8)!
                print("retrieved api key:", apiKeyString)
            } catch {
                print("error in retrieving the message")
            }
        } else {
            return
        }
        
#endif
    }
    
    //@IBAction func saveApiKey(_ sender: AnyObject?) {
    //
    //}
}

