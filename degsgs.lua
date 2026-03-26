server = HttpServer.new()
indexbot=3 --index bot for growscan
WH_url="xxx" --webhook statusChannel


server:setLogger(function(request, response)
  print(string.format("Method: %s, Path: %s, Status: %i", request.method, request.path, response.status))
end)

server:get("/api/tes", function(request, response)
    world=request:getParam("world")
    indexbot=3 --same
    tokenLu="kontol" --key for auth api
    
    bot=getBots()[indexbot]
    function valueToJson(v)
        if type(v) == "string" then
            return '"' .. v:gsub('"', '\\"') .. '"'
        elseif type(v) == "number" then
            return tostring(v)
        elseif type(v) == "boolean" then
            return v and "true" or "false"
        elseif type(v) == "table" then
            return tableToJson(v)
        else
            return '"' .. tostring(v) .. '"'
        end
    end
    
    function tableToJson(tbl)
        local is_array = true
        for k in pairs(tbl) do
            if type(k) ~= "number" then
                is_array = false
                break
            end
        end
        
        local result = {}
        
        if is_array then
            -- Format sebagai array JSON
            for i, v in ipairs(tbl) do
                table.insert(result, valueToJson(v))
            end
            return "[" .. table.concat(result, ",") .. "]"
        else
            local first = true
            for k, v in pairs(tbl) do
                if not first then
                    table.insert(result, ",")
                end
                first = false
                
                table.insert(result, '"' .. tostring(k) .. '":' .. valueToJson(v))
            end
            return "{" .. table.concat(result) .. "}"
        end
    end

	
    
    function warps(tothew)
       bot:getConsole().enabled = true
        
        for i = 1, 50 do
		    bot:getConsole():append("")
		  end
        
        for i=1,3 do
            if not bot:isInWorld(tothew:upper()) then
                bot:warp(tothew)
                listenEvents(5)
                
				for _, content in pairs(bot:getConsole().contents) do
				    if content:find("inaccessible") then
						return {status=false,message="World Nuked"}
					elseif content:find("Players lower") then
						return {status=false,message="Bot cant enter world cuz lvl or hard warp"}
					end
				end
                
            else
                return {status=true}
            end
        end
        
        if not bot:isInWorld(tothew:upper()) then
            return {status=false,message="Bot cant enter world cuz lvl or hard warp"} 
        end
    end
    
    
    
    function scanWorld(world)
        if bot.status ~= 1 then
            return '{ "status": false,"message": "Bot is offline <a:offline:1397515323774603354>" }'
		end
        objectlist={}
        local successWarp=warps(world)
        if not successWarp.status then
            bot:warp("exit")
            return '{ "status": false,"message": "'..successWarp.message..'" }'
        else
            growscan=bot:getWorld().growscan
            for id,counts in pairs(growscan:getObjects()) do
                table.insert(objectlist,{
                    tipe="floating",
                    count=counts,
                    name=getInfo(id).name
                })
            end
            for id,counts in pairs(growscan:getTiles()) do
                table.insert(objectlist,{
                    tipe="block",
                    count=counts,
                    name=getInfo(id).name
                })
            end
            bot:warp("exit")
            return  '{ "status": true,"scanned": '..tableToJson(objectlist)..'}'
        end
      
    end 
    
    if world==nil or world == "" then
        return response:setContent('{ "status": false,"message": "enter world lol" }',"application/json")
    else
        if request:getParam("token") == tokenLu then
           return response:setContent(scanWorld(world),"application/json")
        else
            return response:setContent('{ "status": false,"message": "Wrong Token LOL." }',"application/json")
        end
    end
end)

function threadWh(indexbot,whurl)
while true do
	webhook = Webhook.new(whurl)
	if getBot(indexbot) and getBot(indexbot).status == 1 then
	webhook.content = "degsgrowscan|1"
	else 
	webhook.content = "degsgrowscan|0"
	end
	webhook:send()
	print('status polling interval')
sleep(30000)
end
end

runThread(threadWh,indexbot,WH_url)

server:listen("0.0.0.0", 5000)

