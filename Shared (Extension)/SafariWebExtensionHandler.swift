//
//  SafariWebExtensionHandler.swift
//  Shared (Extension)
//
//  Created by Marko Simic on /915/22.
//

import SafariServices
import os.log

let account = "openai"
let service = "api-token"

struct webPageText {
    var text: String
}

struct requestBody: Codable {
    var model: String
    var temperature: Double
    var max_tokens: Int
    var prompt: String
}

struct choices: Codable {
    var text: String
    var index: Int
    var logprobs: Int?
    var finish_reason: String
}

struct complemtionResponse: Codable {
    var id: String
    var object: String
    var created: Int
    var model: String
    var choices: [choices]
    var usage: [String: Int]
}

func prepareRequest(prompt: String, apiKey: String) -> URLRequest {
    // Prepare URL
    let url = URL(string: "https://api.openai.com/v1/completions")
    guard let requestUrl = url else { fatalError() }

    // Prepare URL Request Object
    var request = URLRequest(url: requestUrl)
    request.httpMethod = "POST"
    print("url:", request)

    // Set HTTP Requst Header
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")

    // Set HTTP Request Body
    let params = requestBody(model: "text-davinci-002", temperature: 0.7, max_tokens: 256, prompt: prompt)
    let jsonData = try? JSONEncoder().encode(params)

    request.httpBody = jsonData
    
    return request
}

func performRequest(request: URLRequest, context: NSExtensionContext) {
    // Perform HTTP Request
    let task = URLSession.shared.dataTask(with: request) { (data, response, error) in
        if let error = error {
            print(error)
            return
        }
        
        do {
            // decode json data
            let decoder = JSONDecoder()
            let object = try decoder.decode(complemtionResponse.self, from: data!)
            
            // handle success
            if #available(macOSApplicationExtension 11.0, *) {
                os_log(.default, "$$$$$$$$$$$$$ AI answer: \(object.choices[0].text, privacy: .public)")
            } else {
                // Fallback on earlier versions
            }
            
            let response = NSExtensionItem()
            response.userInfo = [ SFExtensionMessageKey: [ object.choices[0].text ] ]
            context.completeRequest(returningItems: [response], completionHandler: nil)
        } catch let error {
            // handle json decoding error
            print(error)
        }
    }
    task.resume()
}

let SFExtensionMessageKey = "message"

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {

    func beginRequest(with context: NSExtensionContext) {
        let item = context.inputItems[0] as! NSExtensionItem
        let message = item.userInfo?[SFExtensionMessageKey]
        let messageDict = message as! NSDictionary
        var messageContent = messageDict.value(forKey: "message") as! String
        messageContent = "Summarize the following text in less than 10 bulletpoints: " + "\"" + messageContent + "\""
        if #available(macOSApplicationExtension 11.0, *) {
            os_log(.default, "This is the text from web: \(messageContent, privacy: .public)")
        } else {
            // Fallback on earlier versions
        }
        os_log(.default, "Received message from browser.runtime.sendNativeMessage: %@", message as! CVarArg)
        
        do {
            let apiKey = try KeychainHelper.readPassword(service: service, account: account)
            let apiKeyString = String(data: apiKey, encoding: .utf8)!
            
            let request = prepareRequest(prompt: messageContent, apiKey: apiKeyString)
            performRequest(request: request, context: context)
        } catch {
            print("something went wrong with retreiving the api key")
        }
    }

}
