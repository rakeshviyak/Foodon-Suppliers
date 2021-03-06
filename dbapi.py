import endpoints
from urllib2 import urlopen
import json
from google.appengine.ext import ndb
from protorpc import remote
from endpoints_proto_datastore.ndb import EndpointsModel, EndpointsDateProperty
import inspect
import logging

import secrets


class SellerProfile(EndpointsModel):
    _message_fields_schema = (
        'id', 'sellerid', 'name', 'email', 'link', 'picture', 'gender',
        'shopname', 'regno', 'address', 'pincode', 'location', 'shopdescription',
        'starttime', 'endtime')
    sellerid = ndb.StringProperty()
    name = ndb.StringProperty()
    email = ndb.StringProperty()
    link = ndb.StringProperty()
    picture = ndb.StringProperty()
    gender = ndb.StringProperty()
    shopname = ndb.StringProperty()
    regno = ndb.StringProperty()
    address = ndb.TextProperty()
    pincode = ndb.IntegerProperty()
    location = ndb.GeoPtProperty()
    shopdescription = ndb.TextProperty()
    starttime = ndb.TimeProperty()
    endtime = ndb.TimeProperty()
    created = ndb.DateTimeProperty(auto_now_add=True)
    modified = ndb.DateTimeProperty(auto_now=True)


class MyModel(EndpointsModel):
    _message_fields_schema = (
        'id', 'productname', 'category', 'offerprice', 'usualprice', 'doe', 'owner', 'productimg')
    productname = ndb.StringProperty()
    category = ndb.StringProperty()
    offerprice = ndb.FloatProperty()
    usualprice = ndb.FloatProperty()
    doe = EndpointsDateProperty()
    productimg = ndb.BlobProperty()
    owner = ndb.UserProperty()
    created = ndb.DateTimeProperty(auto_now_add=True)
    modified = ndb.DateTimeProperty(auto_now=True)


# Use of this decorator is the same for APIs created with or without
# endpoints-proto-datastore.
@endpoints.api(allowed_client_ids=[secrets.WEB_CLIENT_ID, secrets.ANDROID_CLIENT_ID,
                                   secrets.IOS_CLIENT_ID, endpoints.API_EXPLORER_CLIENT_ID],
               audiences=[secrets.ANDROID_AUDIENCE],
               scopes=[endpoints.EMAIL_SCOPE],
               name=secrets.API_NAME, version=secrets.API_VERSION, description=secrets.API_DESCRIPTITON)
class MyApi(remote.Service):

    @SellerProfile.method(path='sellerprofile', http_method='POST',
                          name='sellerprofile.insert')
    def SellerProfileInsert(self, seller_profile):
        logging.info(seller_profile)
        if seller_profile.pincode:
            resource_url = "http://maps.googleapis.com/maps/api/geocode/json?address=" + \
                str(seller_profile.pincode) + ",+SG&sensor=false"
            l = json.loads(urlopen(resource_url).read())
            seller_profile.location = ndb.GeoPt(l['results'][0]['geometry']['location']['lat'],
                                                l['results'][0]['geometry']['location']['lng'])
        seller_profile.put()
        return seller_profile

    @SellerProfile.query_method(query_fields=('limit', 'order', 'pageToken', 'sellerid'),
                                path='sellerprofiles',
                                name='sellerprofile.list')
    def SellerProfileList(self, query):
        return query

    @MyModel.method(path='mymodel', http_method='POST',
                    name='mymodel.insert')
    def MyModelInsert(self, my_model):
        logging.info(endpoints.get_current_user())
        logging.info(my_model)
        my_model.owner = endpoints.get_current_user()
        my_model.put()
        return my_model

    @MyModel.query_method(query_fields=('limit', 'order', 'pageToken'),
                          path='mymodels',
                          name='mymodel.list')
    def MyModelList(self, query):
        # return query.filter(MyModel.owner == endpoints.get_current_user())
        return query

    @MyModel.method(request_fields=('id',),
                    path='mymodel/{id}', http_method='GET', name='mymodel.getByID')
    def MyModelGetByID(self, my_model):
        logging.info(my_model)
        if not my_model.from_datastore:
            raise endpoints.NotFoundException('MyModel not found.')
        return my_model


# Use of endpoints.api_server is the same for APIs created with or without
# endpoints-proto-datastore.
APPLICATION = endpoints.api_server([MyApi], restricted=False)
