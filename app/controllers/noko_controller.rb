class NokoController < ApplicationController
  def grab_text
    client = RestClient.get(params[:url], user_agent: 'Chrome')
    noko_client = Nokogiri::HTML(client)
    body_text = noko_client.css(".usertext-body")[1]

    render text: body_text
  end
end
